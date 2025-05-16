import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { MarketData } from '../entities/marketdata.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CashService } from '../shared/cash.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(MarketData)
    private readonly marketRepo: Repository<MarketData>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly cashService: CashService,
  ) {}

  private async getShares(
    userId: number,
    instrumentid: number,
  ): Promise<number> {
    const { shares } = await this.orderRepo
      .createQueryBuilder('o')
      .select(
        `
        SUM(CASE 
          WHEN o.side = 'BUY' THEN o.size 
          WHEN o.side = 'SELL' THEN -o.size 
          ELSE 0 END)`,
        'shares',
      )
      .where('o.userId = :userId', { userId })
      .andWhere('o.instrumentid = :instrumentid', { instrumentid })
      .andWhere('o.status = :status', { status: 'FILLED' })
      .getRawOne();

    return parseFloat(shares) || 0;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const { userId, instrumentid, side, size, type } = dto;

    const market = await this.marketRepo.findOne({
      where: { instrumentid },
      order: { date: 'DESC' },
    });
    if (!market) throw new NotFoundException('Market price not found');

    const price = market.close;
    let status: Order['status'] = 'NEW';

    const total = price * size;

    if (type === 'MARKET') {
      if (side === 'BUY') {
        const cash = await this.cashService.getCash(userId);
        status = cash >= total ? 'FILLED' : 'REJECTED';
      } else if (side === 'SELL') {
        const shares = await this.getShares(userId, instrumentid);
        status = shares >= size ? 'FILLED' : 'REJECTED';
      } else {
        status = 'REJECTED';
      }
    }

    const order = this.orderRepo.create({
      ...dto,
      price,
      status,
      datetime: new Date(),
    });

    return this.orderRepo.save(order);
  }

  async cancelOrder(id: number): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'NEW') {
      throw new BadRequestException('Only NEW orders can be cancelled');
    }

    order.status = 'CANCELLED';
    return this.orderRepo.save(order);
  }
}

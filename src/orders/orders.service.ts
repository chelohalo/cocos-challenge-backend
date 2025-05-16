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
    userid: number,
    instrumentid: number,
  ): Promise<number> {
    const orders = await this.orderRepo.find({
      where: {
        userid: userid,
        instrumentid: instrumentid,
        status: 'FILLED',
      },
    });

    let shares = 0;
    for (const order of orders) {
      if (order.side === 'BUY') {
        shares += order.size;
      } else if (order.side === 'SELL') {
        shares -= order.size;
      }
    }

    return shares;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const { userid, instrumentid, side, size, type } = dto;

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
        const cash = await this.cashService.getCash(userid);
        status = cash >= total ? 'FILLED' : 'REJECTED';
      } else if (side === 'SELL') {
        const shares = await this.getShares(userid, instrumentid);
        status = shares >= size ? 'FILLED' : 'REJECTED';
      } else {
        status = 'REJECTED';
      }
    }

    const now = new Date();
    now.setMilliseconds(0);

    const order = this.orderRepo.create({
      ...dto,
      instrumentid,
      userid,
      price,
      status,
      datetime: now,
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

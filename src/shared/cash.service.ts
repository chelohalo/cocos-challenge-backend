import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  async getCash(userid: number): Promise<number> {
    const result = await this.orderRepo
      .createQueryBuilder('o')
      .select('o.side', 'side')
      .addSelect('o.size', 'size')
      .addSelect('o.price', 'price')
      .where('o.userid = :userid', { userid })
      .andWhere('o.status = :status', { status: 'FILLED' })
      .getRawMany();

    const cash = result.reduce((total, order) => {
      switch (order.side) {
        case 'CASH_IN':
          return total + parseFloat(order.size);
        case 'CASH_OUT':
          return total - parseFloat(order.size);
        case 'BUY':
          return total - parseFloat(order.size) * parseFloat(order.price);
        case 'SELL':
          return total + parseFloat(order.size) * parseFloat(order.price);
        default:
          return total;
      }
    }, 0);

    return cash;
  }
}

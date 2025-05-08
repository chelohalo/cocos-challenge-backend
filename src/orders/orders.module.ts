import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../entities/order.entity';
import { MarketData } from '../entities/marketdata.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, MarketData, User])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

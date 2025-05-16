import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { CashService } from './cash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [CashService],
  exports: [CashService],
})
export class SharedModule {}

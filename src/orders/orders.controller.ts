import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '../entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    const order = await this.ordersService.create(dto);
    if (order.status === 'REJECTED') {
      throw new BadRequestException(
        'Insufficient funds or shares for this order',
      );
    }
    return order;
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: number): Promise<Order> {
    return this.ordersService.cancelOrder(id);
  }
}

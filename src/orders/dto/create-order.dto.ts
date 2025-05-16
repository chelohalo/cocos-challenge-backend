import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsInt,
} from 'class-validator';

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export class CreateOrderDto {
  @IsInt()
  userid: number;

  @IsInt()
  instrumentid: number;

  @IsEnum(OrderSide)
  side: OrderSide;

  @IsEnum(OrderType)
  type: OrderType;

  @IsNumber()
  @IsPositive()
  size: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}

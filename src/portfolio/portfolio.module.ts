import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { Order } from '../entities/order.entity';
import { Instrument } from '../entities/instrument.entity';
import { MarketData } from '../entities/marketdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Instrument, MarketData])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}

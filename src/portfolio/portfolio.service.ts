import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { Instrument } from '../entities/instrument.entity';
import { MarketData } from '../entities/marketdata.entity';
import { PortfolioDTO, PositionDTO } from './dto/portfolio.dto';
import { CashService } from '../shared/cash.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Instrument)
    private instrumentRepo: Repository<Instrument>,
    @InjectRepository(MarketData)
    private marketRepo: Repository<MarketData>,
    private readonly cashService: CashService,
  ) {}

  async getPositions(userid: number): Promise<PositionDTO[]> {
    const orders = await this.orderRepo.find({
      where: { userid, status: 'FILLED' },
    });

    const grouped = new Map<number, number>();

    for (const o of orders) {
      if (o.side === 'BUY') {
        grouped.set(
          o.instrumentid,
          (grouped.get(o.instrumentid) || 0) + o.size,
        );
      }
      if (o.side === 'SELL') {
        grouped.set(
          o.instrumentid,
          (grouped.get(o.instrumentid) || 0) - o.size,
        );
      }
    }

    const result: PositionDTO[] = [];

    for (const [instrumentid, quantity] of grouped) {
      if (quantity <= 0) continue;

      const instrument = await this.instrumentRepo.findOne({
        where: { id: instrumentid },
      });
      const [latest, previous] = await this.marketRepo.find({
        where: { instrumentid },
        order: { date: 'DESC' },
        take: 2,
      });

      if (!instrument || !latest || !previous) continue;

      const currentPrice = latest.close;
      const totalValue = quantity * currentPrice;
      const returnPercentage =
        ((latest.close - previous.close) / previous.close) * 100;

      result.push({
        instrumentid,
        ticker: instrument.ticker,
        name: instrument.name,
        quantity,
        currentPrice,
        totalValue,
        returnPercentage: parseFloat(returnPercentage.toFixed(2)),
      });
    }

    return result;
  }

  async getPortfolio(userId: number): Promise<PortfolioDTO> {
    const cash = await this.cashService.getCash(userId);
    const positions = await this.getPositions(userId);
    const assetsValue = positions.reduce((sum, p) => sum + p.totalValue, 0);

    return {
      cash,
      totalValue: cash + assetsValue,
      positions,
    };
  }
}

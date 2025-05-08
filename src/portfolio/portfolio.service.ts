import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { Instrument } from '../entities/instrument.entity';
import { MarketData } from '../entities/marketdata.entity';
import { PortfolioDTO, PositionDTO } from './dto/portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Instrument)
    private instrumentRepo: Repository<Instrument>,
    @InjectRepository(MarketData)
    private marketRepo: Repository<MarketData>,
  ) {}

  async getCash(userId: number): Promise<number> {
    const { cash } = await this.orderRepo
      .createQueryBuilder('o')
      .select(
        `
        SUM(CASE 
          WHEN o.side = 'CASH_IN' THEN o.size 
          WHEN o.side = 'CASH_OUT' THEN -o.size 
          WHEN o.side = 'BUY' THEN -o.size * o.price 
          WHEN o.side = 'SELL' THEN o.size * o.price 
          ELSE 0 END)`,
        'cash',
      )
      .where('o.userId = :userId', { userId })
      .andWhere('o.status = :status', { status: 'FILLED' })
      .getRawOne();

    return parseFloat(cash) || 0;
  }

  async getPositions(userId: number): Promise<PositionDTO[]> {
    const orders = await this.orderRepo.find({
      where: { userId, status: 'FILLED' },
    });

    const grouped = new Map<number, number>();

    for (const o of orders) {
      if (o.side === 'BUY') {
        grouped.set(
          o.instrumentId,
          (grouped.get(o.instrumentId) || 0) + o.size,
        );
      }
      if (o.side === 'SELL') {
        grouped.set(
          o.instrumentId,
          (grouped.get(o.instrumentId) || 0) - o.size,
        );
      }
    }

    const result: PositionDTO[] = [];

    for (const [instrumentId, quantity] of grouped) {
      if (quantity <= 0) continue;

      const instrument = await this.instrumentRepo.findOne({
        where: { id: instrumentId },
      });
      const [latest, previous] = await this.marketRepo.find({
        where: { instrumentId },
        order: { datetime: 'DESC' },
        take: 2,
      });

      if (!instrument || !latest || !previous) continue;

      const currentPrice = latest.close;
      const totalValue = quantity * currentPrice;
      const returnPercentage =
        ((latest.close - previous.close) / previous.close) * 100;

      result.push({
        instrumentId,
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
    const cash = await this.getCash(userId);
    const positions = await this.getPositions(userId);
    const assetsValue = positions.reduce((sum, p) => sum + p.totalValue, 0);

    return {
      cash,
      totalValue: cash + assetsValue,
      positions,
    };
  }
}

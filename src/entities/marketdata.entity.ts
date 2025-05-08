import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @Column('float', { nullable: true })
  high: number;

  @Column('float', { nullable: true })
  low: number;

  @Column('float', { nullable: true })
  open: number;

  @Column('float')
  close: number;

  @Column({ name: 'previousclose', type: 'float' })
  previousClose: number;

  @Column({ name: 'date' })
  datetime: Date;
}

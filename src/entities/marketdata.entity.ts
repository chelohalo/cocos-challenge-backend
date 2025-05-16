import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instrumentid: number;

  @Column('float')
  high: number;

  @Column('float')
  low: number;

  @Column('float')
  open: number;

  @Column('float')
  close: number;

  @Column({ type: 'float' })
  previousclose: number;

  @Column()
  date: Date;
}

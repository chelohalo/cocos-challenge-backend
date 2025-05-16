import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instrumentid: number;

  @Column('float', { nullable: true })
  high: number;

  @Column('float', { nullable: true })
  low: number;

  @Column('float', { nullable: true })
  open: number;

  @Column('float')
  close: number;

  @Column({ type: 'float' })
  previousClose: number;

  @Column()
  date: Date;
}

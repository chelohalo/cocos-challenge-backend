import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instrumentid: number;

  @Column()
  userid: number;

  @Column('float')
  size: number;

  @Column('float')
  price: number;

  @Column()
  type: 'MARKET' | 'LIMIT';

  @Column()
  side: 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT';

  @Column()
  status: 'NEW' | 'FILLED' | 'REJECTED' | 'CANCELLED';

  @Column({ type: 'timestamp', precision: 0 })
  datetime: Date;
}

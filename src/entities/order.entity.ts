import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'instrumentid' }) // o 'instrument_id' si lo corregís
  instrumentId: number;

  @Column({ name: 'userid' }) // o 'user_id' si corregís nombre
  userId: number;

  @Column('float')
  size: number;

  @Column('float', { nullable: true })
  price: number;

  @Column()
  type: 'MARKET' | 'LIMIT';

  @Column()
  side: 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT';

  @Column()
  status: 'NEW' | 'FILLED' | 'REJECTED' | 'CANCELLED';

  @Column()
  datetime: Date;
}

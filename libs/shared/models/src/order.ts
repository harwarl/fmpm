import { Currency } from '@fmpm/dtos';
import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum OrderType {
  BUY = 'buy',
  SELL = 'sell',
}

@Entity({ name: 'orders' })
export class Order {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: 'string', default: '' })
  userId!: string;

  @Column({ type: 'string', enum: OrderType })
  order_type!: string;

  @Column({ type: 'string', default: '', enum: Currency })
  base_currency!: Currency;

  @Column({ type: 'string', default: '', enum: Currency })
  quote_currency!: Currency;

  @Column({ type: 'float64', default: 0 })
  amount!: number;

  @Column({ type: 'float64', default: 0 })
  rate!: number;

  @Column({ type: 'string', enum: OrderStatus })
  status!: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at!: Date;
}

import { Currency } from '@fmpm/dtos';
import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { OrderStatus } from './order';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  CONVERSION = 'conversion',
}

@Entity({ name: 'transactions' })
export class Transactions {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: 'string' })
  userId!: string;

  @Column({ type: 'string', default: '' })
  walletId!: string;

  @Column({ type: 'string', default: 'credit', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'float64', default: 0 })
  amount!: number;

  @Column({ type: 'string', default: '', enum: Currency })
  currency!: Currency;

  @Column({ type: 'string', default: '' })
  metadata!: string;

  @Column({ type: 'string', default: '', enum: OrderStatus })
  status!: OrderStatus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;
}

import { Currency } from '@fmpm/dtos';
import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

export enum TransactionStatus {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity({ name: 'order_transactions' })
export class OrderTransactions {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: 'string', default: '' })
  orderId!: string;

  @Column({ type: 'string', default: '' })
  userId!: string;

  @Column({ type: 'string', default: '', enum: Currency })
  base_currency!: Currency;

  @Column({ type: 'string', default: '', enum: Currency })
  quote_currency!: Currency;

  @Column({ type: 'float64', default: 0 })
  amount!: number;

  @Column({ type: 'float64', default: 0 })
  rate!: number;

  @Column({ type: 'string', enum: TransactionStatus })
  status!: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;
}

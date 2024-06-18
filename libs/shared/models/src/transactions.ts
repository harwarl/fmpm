import { Currency } from '@fmpm/dtos';
import { ObjectId } from 'mongodb';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity({ name: 'transactions' })
export class Transactions {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: 'string', default: '' })
  walletId!: string;

  @Column({ type: 'string', default: 'credit', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'float64', default: 0 })
  amount!: number;

  @Column({ type: 'string', default: '', enum: Currency })
  currency!: Currency;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;
}

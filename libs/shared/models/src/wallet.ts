import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '@fmpm/dtos';
@Entity({ name: 'wallets' })
export class Wallet {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: 'string' })
  userId!: ObjectId;

  @Column({ type: 'string', enum: Currency })
  currency!: Currency;

  @Column({ type: 'float64', default: 0 })
  balance!: number;

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

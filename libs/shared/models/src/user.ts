import {
  Entity,
  ObjectId,
  ObjectIdColumn,
  Column,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { BcryptService } from '@fmpm/helpers';

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: 'string', default: '' })
  firstName!: string;

  @Column({ type: 'string', default: '' })
  lastName!: string;

  @Column({ type: 'string', unique: true })
  username!: string;

  @Column({ type: 'string' })
  password!: string;

  @Column({ type: 'string', unique: true })
  email!: string;

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

  @Column({ type: 'string', default: '' })
  bio!: string;

  @Column({ type: 'string', default: '' })
  profilePic!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await new BcryptService().hashPassword(this.password);
  }
}

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HelperService } from '../helper/helper.service';

@Entity({ name: 'user' })
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: 'string' })
  firstName: string;

  @Column({ type: 'string' })
  lastName: string;

  @Column({ type: 'string' })
  username: string;

  @Column({ type: 'string' })
  password: string;

  @Column({ type: 'string' })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'string', default: '' })
  bio: string;

  @Column({ type: 'string', default: '' })
  profilePic: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await new HelperService().hashPassword(this.password);
  }
}

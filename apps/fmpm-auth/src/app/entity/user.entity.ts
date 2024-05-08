import {
  BeforeInsert,
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import { HelperService } from '../helper/helper.service';

@Entity({ name: 'user' })
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
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

import { hash } from 'bcrypt';
import {
  Entity,
  ObjectId,
  ObjectIdColumn,
  Column,
  BeforeInsert,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  username!: string;

  @Column({ select: false })
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}

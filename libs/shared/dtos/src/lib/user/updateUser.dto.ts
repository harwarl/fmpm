import { ObjectId } from 'typeorm';

export class UpdateUserDto {
  readonly currentUserId!: ObjectId;
  readonly email!: string;
  readonly username!: string;
  readonly password!: string;
  readonly firstName!: string;
  readonly lastName!: string;
  readonly bio!: string;
  readonly profilePic!: string;
}

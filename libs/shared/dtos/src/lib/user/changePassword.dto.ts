import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export class ChangePasswordDto {
  @IsNotEmpty()
  readonly currentUserId!: ObjectId;
  @IsNotEmpty()
  readonly password!: string;
}

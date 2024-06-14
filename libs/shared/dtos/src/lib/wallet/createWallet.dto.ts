import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export enum Currency {
  NGN = 'NGN',
  GBP = 'GBP',
  USD = 'USD',
}
export class CreateWalletBodyDto {
  @IsNotEmpty()
  currency!: Currency;
}

export class CreateWalletDto {
  @IsNotEmpty()
  @IsMongoId()
  userId!: ObjectId;

  @IsNotEmpty()
  currency!: Currency;
}

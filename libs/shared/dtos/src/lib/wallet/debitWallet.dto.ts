import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Currency } from './createWallet.dto';

export class DebitWalletDto {
  @IsNotEmpty()
  @IsMongoId()
  userId!: ObjectId;

  @IsNotEmpty()
  @IsString()
  currency!: Currency;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;
}

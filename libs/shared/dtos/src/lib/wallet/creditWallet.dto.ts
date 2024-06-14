import { IsMongoId, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Currency } from './createWallet.dto';

export class CreditWalletDto {
  @IsNotEmpty()
  @IsMongoId()
  senderId!: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  walletId!: ObjectId;

  @IsNotEmpty()
  @IsString()
  currency!: Currency;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;
}

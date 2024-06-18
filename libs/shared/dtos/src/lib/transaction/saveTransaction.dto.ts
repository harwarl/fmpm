import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaveTransactionDto {
  @IsNotEmpty()
  @IsString()
  readonly walletId!: string;

  @IsNotEmpty()
  @IsString()
  readonly type!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount!: number;

  @IsNotEmpty()
  @IsString()
  readonly currency!: string;
}

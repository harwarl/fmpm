import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaveTransactionDto {
  @IsNotEmpty()
  @IsString()
  readonly userId!: string;

  @IsNotEmpty()
  @IsString()
  readonly walletId!: string;

  @IsNotEmpty()
  @IsString()
  readonly metadata!: string;

  @IsNotEmpty()
  @IsString()
  readonly type!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount!: number;

  @IsNotEmpty()
  @IsString()
  readonly currency!: string;

  @IsNotEmpty()
  @IsString()
  readonly status!: string;
}

export class GetTransactionsFilterDto {
  @IsNumber()
  readonly limit!: number;

  @IsNumber()
  readonly page!: number;

  @IsString()
  readonly userId!: string;
}

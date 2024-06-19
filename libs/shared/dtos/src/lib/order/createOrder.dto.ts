import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  order_type!: string;

  @IsNotEmpty()
  @IsString()
  base_currency!: string;

  @IsNotEmpty()
  @IsString()
  quote_currency!: string;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsNotEmpty()
  @IsNumber()
  rate!: number;

  @IsNotEmpty()
  @IsNumber()
  status!: string;
}

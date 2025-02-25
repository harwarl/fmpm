import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateOrderPayloadDto {
  @IsString()
  orderId!: string;

  @IsString()
  order_type!: string;

  @IsString()
  base_currency!: string;

  @IsString()
  quote_currency!: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  rate!: number;

  @IsNotEmpty()
  @IsNumber()
  status!: string;
}

export class UpdateOrderDto {
  @IsString()
  order_type!: string;

  @IsString()
  base_currency!: string;

  @IsString()
  quote_currency!: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  rate!: number;

  @IsNotEmpty()
  @IsNumber()
  status!: string;
}

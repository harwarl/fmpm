import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteOrderDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;
}

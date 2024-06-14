import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConvertWalletDto {
  @IsNotEmpty()
  @IsString()
  senderId!: string;

  @IsNotEmpty()
  @IsString()
  receiverId!: string;

  @IsNotEmpty()
  @IsNumber()
  amount!: string;
}

import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongoModule, RabbitMQModule } from '@fmpm/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '@fmpm/models';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), RabbitMQModule, MongoModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}

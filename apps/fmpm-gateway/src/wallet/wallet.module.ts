import { Queues, Services } from '@fmpm/constants';
import { RabbitMQModule } from '@fmpm/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletController } from './wallet.controller';

@Module({
  imports: [
    RabbitMQModule,
    RabbitMQModule.registerRmq(Services.WALLET_SERVICE, Queues.WALLET_QUEUE),
    RabbitMQModule.registerRmq(Services.AUTH_SERVICE, Queues.AUTH_QUEUE),
    RabbitMQModule.registerRmq(
      Services.INTEGRATION_SERVICE,
      Queues.INTEGRATION_QUEUE
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [WalletController],
  providers: [],
})
export class WalletModule {}

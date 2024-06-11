import { Queues, Services } from '@fmpm/constants';
import { RabbitMQModule } from '@fmpm/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RateController } from './rate.controller';

@Module({
  imports: [
    RabbitMQModule,
    RabbitMQModule.registerRmq(
      Services.INTEGRATION_SERVICE,
      Queues.INTEGRATION_QUEUE
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [RateController],
  providers: [],
})
export class RateModule {}

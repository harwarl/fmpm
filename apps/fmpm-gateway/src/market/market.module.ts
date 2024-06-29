import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { RabbitMQModule } from '@fmpm/modules';
import { Queues, Services } from '@fmpm/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    RabbitMQModule.registerRmq(
      Services.TRANSACTION_ORDER_SERVICE,
      Queues.TRANSACTION_ORDER_QUEUE
    ),
    ClientsModule.register([
      {
        name: Services.GRPC_RATE_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'rate',
          protoPath: join(__dirname, '../proto/rate.proto'),
        },
      },
    ]),
  ],
  providers: [MarketService],
})
export class MarketModule {}

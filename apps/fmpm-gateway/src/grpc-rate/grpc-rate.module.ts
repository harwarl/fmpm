import { Module } from '@nestjs/common';
import { GRPCRateController } from './grpc-rate.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Queues, Services } from '@fmpm/constants';
import { join } from 'path';
import { RabbitMQModule } from '@fmpm/modules';

@Module({
  imports: [
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
    RabbitMQModule.registerRmq(Services.AUTH_SERVICE, Queues.AUTH_QUEUE),
  ],
  controllers: [GRPCRateController],
  providers: [],
})
export class GRPCRateModule {}

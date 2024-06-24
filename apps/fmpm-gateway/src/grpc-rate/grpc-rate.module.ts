import { Module } from '@nestjs/common';
import { GRPCRateController } from './grpc-rate.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from '@fmpm/constants';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RATE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: Services.GRPC_RATE_SERVICE,
          protoPath: join(__dirname, '../rate_proto/rate.proto'),
        },
      },
    ]),
  ],
  controllers: [GRPCRateController],
  providers: [],
})
export class GRPCRateModule {}

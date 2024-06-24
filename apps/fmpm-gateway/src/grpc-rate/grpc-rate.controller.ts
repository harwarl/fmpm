import { Services } from '@fmpm/constants';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

export class GRPCRateController {
  constructor(
    @Inject(Services.GRPC_RATE_SERVICE)
    private readonly grpc_rate_service: ClientGrpc
  ) {}

  
}

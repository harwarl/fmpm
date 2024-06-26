import { Controller } from '@nestjs/common';
import { RateService } from './rate.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from 'grpc';

@Controller()
export class RateController {
  constructor(private readonly rateService: RateService) {}
  @GrpcMethod('RateService', 'GetExchangeRates')
  getExchangeRates(data, metadata: Metadata, call: ServerUnaryCall<any>) {
    return this.rateService.getExchangeRates(data.baseRate);
  }

  @GrpcMethod('RateService', 'GetExchangeRate')
  getExchangeRate(data, metadata: Metadata, call: ServerUnaryCall<any>) {
    return this.rateService.getExchangeRate(data.base, data.target);
  }

  @GrpcMethod('RateService', 'GetExchangeAmount')
  getExchangeAmount(data, metadata: Metadata, call: ServerUnaryCall<any>) {
    return this.rateService.getExchangeAmount(
      data.base,
      data.target,
      data.amount
    );
  }
}

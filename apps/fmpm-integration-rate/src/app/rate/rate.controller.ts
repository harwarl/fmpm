import { Query, Controller, Get, Post, Body } from '@nestjs/common';
import { RateService } from './rate.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitMQService } from '@fmpm/modules';
import { Actions } from '@fmpm/constants';

@Controller('rates')
export class RateController {
  constructor(
    private readonly rateService: RateService,
    private readonly rabbitMqService: RabbitMQService
  ) {}

  @MessagePattern({ cmd: Actions.GET_EXCHANGE_RATES })
  async getExchangeRates(
    @Ctx() context: RmqContext,
    @Payload() payload: { baseRate: string }
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.rateService.getExchangeRates(payload.baseRate);
  }

  @MessagePattern({ cmd: Actions.GET_EXCHANGE_RATE })
  async getExchangeRate(
    @Ctx() context: RmqContext,
    @Payload() payload: { base: string; target: string }
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.rateService.getExchangeRate(payload.base, payload.target);
  }

  @MessagePattern({ cmd: Actions.EXCHANGE_AMOUNT })
  async getExchangeAmount(
    @Ctx() context: RmqContext,
    @Payload() payload: { base: string; target: string; amount: number }
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.rateService.getExchangeAmount(
      payload.base,
      payload.target,
      payload.amount
    );
  }
}

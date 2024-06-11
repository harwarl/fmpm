import { Actions, Services } from '@fmpm/constants';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export type Query = {
  baseRate?: string;
  base?: string;
  target?: string;
};

@Controller('rates')
export class RateController {
  constructor(
    @Inject(Services.INTEGRATION_SERVICE)
    private readonly rmq_rate_client: ClientProxy
  ) {}

  @Get('')
  async getExchangeRates(@Query() query: Query) {
    return await lastValueFrom(
      this.rmq_rate_client.send(
        { cmd: Actions.GET_EXCHANGE_RATES },
        { baseRate: query.baseRate }
      )
    );
  }

  @Get('pair')
  async getExchangeRate(@Query() query: Query) {
    return await lastValueFrom(
      this.rmq_rate_client.send(
        { cmd: Actions.GET_EXCHANGE_RATE },
        { base: query.base, target: query.target }
      )
    );
  }

  @Post('pair')
  async getExchangeAmount(
    @Query() query: Query,
    @Body() body: { amount: number }
  ) {
    return await lastValueFrom(
      this.rmq_rate_client.send(
        { cmd: Actions.EXCHANGE_AMOUNT },
        { base: query.base, target: query.target, amount: body.amount }
      )
    );
  }
}

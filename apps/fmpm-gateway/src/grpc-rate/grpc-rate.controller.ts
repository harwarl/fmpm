import { Services } from '@fmpm/constants';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IExchangeAmount,
  IExchangeRate,
  IExchangeRates,
} from './interfaces/exchangeInput.interface';
import { lastValueFrom, Observable } from 'rxjs';
import {
  IResExchangeAmount,
  IResExchangeRate,
  IResExchangeRates,
} from './interfaces/exchangeOutput.interface';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';

export type Query = {
  baseRate?: string;
  base?: string;
  target?: string;
};

export interface RateService {
  getExchangeRates(data: IExchangeRates): Observable<IResExchangeRates>;
  getExchangeRate(data: IExchangeRate): Observable<IResExchangeRate>;
  getExchangeAmount(data: IExchangeAmount): Observable<IResExchangeAmount>;
}

@Controller('grpc')
export class GRPCRateController {
  private rateService: RateService;
  constructor(
    @Inject(Services.GRPC_RATE_SERVICE)
    private readonly grpc_rate_service: ClientGrpc
  ) {}

  onModuleInit() {
    this.rateService = this.grpc_rate_service.getService('RateService');
  }

  @Get('')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getExchangeRates(@Query('baseRate') baseRate: string) {
    const val = await lastValueFrom(
      this.rateService.getExchangeRates({ baseRate: baseRate })
    );
    return val;
  }

  @Get('pair')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getExchangeRate(@Query() query: Query) {
    const val = await lastValueFrom(
      this.rateService.getExchangeRate({
        base: query.base,
        target: query.target,
      })
    );
    return val;
  }

  @Post('pair')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getExchangeAmount(
    @Query() query: Query,
    @Body() body: { amount: number }
  ) {
    const val = await lastValueFrom(
      this.rateService.getExchangeAmount({
        base: query.base,
        target: query.target,
        amount: body.amount,
      })
    );

    return val;
  }
}

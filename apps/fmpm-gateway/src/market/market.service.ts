import { Services } from '@fmpm/constants';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';
import {
  Inject,
  Injectable,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RateService } from '../grpc-rate/grpc-rate.controller';
import { lastValueFrom } from 'rxjs';
import { Currency } from '@fmpm/dtos';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private rateService: RateService;
  private latestPrices: any;
  constructor(
    @Inject(Services.GRPC_RATE_SERVICE)
    private readonly grpc_rate_service: ClientGrpc
  ) {}

  onModuleInit() {
    this.rateService = this.grpc_rate_service.getService('RateService');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchMarketPrices() {
    try {
      const prices = await lastValueFrom(
        this.rateService.getExchangeRates({
          baseRate: 'USD',
        })
      );
      this.latestPrices = prices.conversionRates;
      this.logger.debug('MARKET PRICES UPDATED');
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    }
  }

  getRecentMarketRate(currency: Currency) {
    return this.latestPrices[currency];
  }
}

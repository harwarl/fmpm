import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';

@Injectable()
export class RateService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('EXCHANGE_RATE_URL');
  }

  async getExchangeRates(baseRate: string) {
    const rateUrl = `${this.baseUrl}/latest/${baseRate}`;
    return this.httpService.get(rateUrl).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error fetching exchange rates:', error.message);
        throw error;
      })
    );
  }

  async getExchangeRate(base: string, target: string) {
    const rateUrl = `${this.baseUrl}/pair/${base}/${target}`;
    return this.httpService.get(rateUrl).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error fetching exchange rates:', error.message);
        throw error;
      })
    );
  }
  async getExchangeAmount(base: string, target: string, amount: number) {
    const rateUrl = `${this.baseUrl}/pair/${base}/${target}/${amount}`;
    return this.httpService.get(rateUrl).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error getting the amount -', error.message);
        throw error;
      })
    );
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class RateService {
  private readonly baseUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.baseUrl = this.configService.get<string>('EXCHANGE_RATE_URL');
  }

  async getExchangeRates(baseRate: string) {
    try {
      const rateUrl = `${this.baseUrl}/latest/${baseRate}`;

      const data = await firstValueFrom(
        this.httpService.get(rateUrl).pipe(
          map((response) => response.data),
          catchError((error) => {
            console.log('Error Fetching Exchange Rates: ', error.message);
            throw error;
          })
        )
      );
      return data;
    } catch (error) {
      console.log(error.message);
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getExchangeRate(base: string, target: string) {
    const rateUrl = `${this.baseUrl}/pair/${base}/${target}`;

    const data = await firstValueFrom(
      this.httpService.get(rateUrl).pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error Fetching Exchange Rate: ', error.message);
          throw error;
        })
      )
    );
    return data;
  }

  async getExchangeAmount(base: string, target: string, amount: number) {
    const rateUrl = `${this.baseUrl}/pair/${base}/${target}/${amount}`;
    const data = await firstValueFrom(
      this.httpService.get(rateUrl).pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error Fetching Exchange Rate: ', error.message);
          throw error;
        })
      )
    );
    return data;
  }
}

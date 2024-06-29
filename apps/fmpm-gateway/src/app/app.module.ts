import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { RateModule } from '../rate/rate.module';
import { WalletModule } from '../wallet/wallet.module';
import { TransactionModule } from '../transaction/transaction.module';
import { OrderModule } from '../order/order.module';
import { GRPCRateModule } from '../grpc-rate/grpc-rate.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    RateModule,
    WalletModule,
    TransactionModule,
    OrderModule,
    GRPCRateModule,
    MarketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

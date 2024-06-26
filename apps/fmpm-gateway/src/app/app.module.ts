import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { RateModule } from '../rate/rate.module';
import { WalletModule } from '../wallet/wallet.module';
import { TransactionModule } from '../transaction/transaction.module';
import { OrderModule } from '../order/order.module';
import { GRPCRateModule } from '../grpc-rate/grpc-rate.module';

@Module({
  imports: [
    AuthModule,
    RateModule,
    WalletModule,
    TransactionModule,
    OrderModule,
    GRPCRateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

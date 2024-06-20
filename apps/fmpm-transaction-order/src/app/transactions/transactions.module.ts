import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongoModule, RabbitMQModule } from '@fmpm/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTransactions, Transactions } from '@fmpm/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions, OrderTransactions]),
    RabbitMQModule,
    MongoModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}

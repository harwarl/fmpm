import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongoModule, RabbitMQModule } from '@fmpm/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from '@fmpm/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions]),
    RabbitMQModule,
    MongoModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}

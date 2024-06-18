import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { RabbitMQModule } from '@fmpm/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'typeorm';

@Module({
  imports: [RabbitMQModule, TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}

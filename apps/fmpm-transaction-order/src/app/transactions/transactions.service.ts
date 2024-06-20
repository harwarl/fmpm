import {
  GetTransactionsFilterDto,
  SaveOrderTransactionDto,
  SaveTransactionDto,
} from '@fmpm/dtos';
import { OrderTransactions, Transactions } from '@fmpm/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepository: MongoRepository<Transactions>,
    @InjectRepository(OrderTransactions)
    private readonly orderTransactionRepository: MongoRepository<OrderTransactions>
  ) {}

  async saveTransaction(
    saveTransactionDto: SaveTransactionDto
  ): Promise<Transactions> {
    const newTransaction = new Transactions();
    Object.assign(newTransaction, saveTransactionDto);
    return await this.transactionRepository.save(newTransaction);
  }

  async saveOrderTransaction(
    saveOrderTransactionDto: SaveOrderTransactionDto
  ): Promise<OrderTransactions> {
    const newOrderTransaction = new OrderTransactions();
    Object.assign(newOrderTransaction, saveOrderTransactionDto);
    return await this.orderTransactionRepository.save(newOrderTransaction);
  }

  async getAllTransactions(
    getTransactionsFilterDto: GetTransactionsFilterDto
  ): Promise<Transactions[]> {
    const limit = getTransactionsFilterDto.limit
      ? getTransactionsFilterDto.limit
      : 10;
    const page = getTransactionsFilterDto.page
      ? getTransactionsFilterDto.page
      : 1;

    return await this.transactionRepository.find({
      where: {
        userId: getTransactionsFilterDto.userId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async getAllOrderTransactions(
    getTransactionsFilterDto: GetTransactionsFilterDto
  ): Promise<OrderTransactions[]> {
    const limit = getTransactionsFilterDto.limit
      ? getTransactionsFilterDto.limit
      : 10;
    const page = getTransactionsFilterDto.page
      ? getTransactionsFilterDto.page
      : 1;

    return await this.orderTransactionRepository.find({
      where: {
        userId: getTransactionsFilterDto.userId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }
}

import { GetTransactionsFilterDto, SaveTransactionDto } from '@fmpm/dtos';
import { Transactions } from '@fmpm/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepository: MongoRepository<Transactions>
  ) {}

  async saveTransaction(
    saveTransactionDto: SaveTransactionDto
  ): Promise<Transactions> {
    const newTransaction = new Transactions();
    Object.assign(newTransaction, saveTransactionDto);
    return await this.transactionRepository.save(newTransaction);
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
}

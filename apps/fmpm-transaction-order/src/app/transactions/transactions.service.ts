import { SaveTransactionDto } from '@fmpm/dtos';
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
    return;
  }
}

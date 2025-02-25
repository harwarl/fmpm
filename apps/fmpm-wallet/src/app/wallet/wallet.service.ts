import { CreateWalletDto, CreditWalletDto, DebitWalletDto } from '@fmpm/dtos';
import { IWalletResponse } from '@fmpm/interfaces';
import { Wallet } from '@fmpm/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: MongoRepository<Wallet>
  ) {}

  async createWallet(createWalletDto: CreateWalletDto) {
    const userWallets = await this.findWalletByUserId(createWalletDto.userId);
    const wallet = userWallets.find(
      (wallet) => wallet.currency === createWalletDto.currency
    );
    if (wallet)
      return new HttpException(
        'User already has this wallet',
        HttpStatus.BAD_REQUEST
      );

    const newWallet = new Wallet();
    Object.assign(newWallet, createWalletDto);
    const savedWallet = await this.walletRepository.save(newWallet);
    return savedWallet;
  }

  //Finds user wallets by userId
  async findWalletByUserId(currentUserId: ObjectId): Promise<Wallet[]> {
    const userWallets = await this.walletRepository.find({
      where: {
        userId: currentUserId,
      },
    });
    return userWallets;
  }

  //Finds the wallet by Id
  async findWalletByWalletId(walletId: ObjectId) {
    const userWallet = await this.walletRepository.findOne({
      where: {
        _id: new ObjectId(walletId),
      },
    });
    return userWallet;
  }

  async creditWallet(creditWalletDto: CreditWalletDto) {
    // const wallet = await this.findWalletByWalletId(creditWalletDto.walletId);
    const wallets = await this.findWalletByUserId(creditWalletDto.senderId);
    const wallet = wallets.find(
      (wallet) => wallet.currency === creditWalletDto.currency
    );
    if (!wallet || wallet.userId !== creditWalletDto.senderId)
      return new HttpException(
        `User does not have a ${creditWalletDto.currency} Wallet`,
        HttpStatus.BAD_REQUEST
      );

    if (typeof creditWalletDto.amount !== 'number')
      return new HttpException('Amount is not a value', HttpStatus.BAD_REQUEST);
    if (wallet.balance) {
      wallet.balance += creditWalletDto.amount;
    } else {
      wallet.balance = creditWalletDto.amount;
    }
    return await this.walletRepository.save(wallet);
  }

  async debitWallet(debitWalletDto: DebitWalletDto) {
    const wallets = await this.findWalletByUserId(debitWalletDto.userId);
    const wallet = wallets.find(
      (wallet) => wallet.currency === debitWalletDto.currency
    );
    if (!wallet)
      return new HttpException(
        `User does not have a ${debitWalletDto.currency} Wallet`,
        HttpStatus.BAD_REQUEST
      );

    if (wallet.balance < debitWalletDto.amount)
      return new HttpException(`Insufficient Funds`, HttpStatus.BAD_REQUEST);
    wallet.balance -= debitWalletDto.amount;
    await this.walletRepository.save(wallet);
    return wallet;
  }

  async getUserWallets(currentUserId: ObjectId) {
    const wallets = await this.findWalletByUserId(currentUserId);
    if (wallets.length <= 0)
      return new HttpException(`No Wallet Found`, HttpStatus.NOT_FOUND);

    return wallets;
  }

  async getWalletById(walletId: ObjectId) {
    const wallet = await this.findWalletByWalletId(walletId);
    if (!wallet)
      return new HttpException('Wallet does not exist', HttpStatus.BAD_REQUEST);
    return wallet;
  }

  buildWalletResponse(
    error: boolean,
    data: { wallet: Wallet | Wallet[] | null },
    message: string
  ): IWalletResponse {
    return {
      error,
      message,
      data,
    };
  }
}

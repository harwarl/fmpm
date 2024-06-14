import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { WalletService } from './wallet.service';
import { CreateWalletDto, CreditWalletDto, DebitWalletDto } from '@fmpm/dtos';
import { Actions } from '@fmpm/constants';
import { RabbitMQService } from '@fmpm/modules';
import { ObjectId } from 'mongodb';

@Controller()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  // @MessagePattern({ cmd: 'EXISTING WALLET' })
  // async findSingleWallet(
  //   @Ctx() context: RmqContext,
  //   @Payload() payload: { walletId: ObjectId }
  // ) {
  //   this.rabbitMQService.acknowledgeMessage(context);
  //   return await this.walletService.findWalletByWalletId(payload.walletId);
  // }

  @MessagePattern({ cmd: Actions.GET_ALL_WALLETS })
  async getAllUserWallets(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: ObjectId }
  ) {
    this.rabbitMQService.acknowledgeMessage(context);
    return this.walletService.getUserWallets(payload.userId);
  }

  @MessagePattern({ cmd: Actions.CREATE_WALLET })
  async createWallet(
    @Ctx() context: RmqContext,
    @Payload() createWalletDto: CreateWalletDto
  ) {
    this.rabbitMQService.acknowledgeMessage(context);
    return await this.walletService.createWallet(createWalletDto);
  }

  @MessagePattern({ cmd: Actions.CREDIT_WALLET })
  async creditWallet(
    @Ctx() context: RmqContext,
    @Payload() creditWalletDto: CreditWalletDto
  ) {
    this.rabbitMQService.acknowledgeMessage(context);
    return await this.walletService.creditWallet(creditWalletDto);
  }

  @MessagePattern({ cmd: Actions.DEBIT_WALLET })
  async debitWallet(
    @Ctx() context: RmqContext,
    @Payload() debitWalletDto: DebitWalletDto
  ) {
    this.rabbitMQService.acknowledgeMessage(context);
    return await this.walletService.debitWallet(debitWalletDto);
  }
}

import { Actions, IRateAmount, Services } from '@fmpm/constants';
import { UserId } from '@fmpm/decorators';
import {
  ConvertWalletDto,
  CreateWalletBodyDto,
  CreateWalletDto,
  CreditWalletDto,
  Currency,
} from '@fmpm/dtos';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { lastValueFrom } from 'rxjs';

@Controller('wallets')
export class WalletController {
  constructor(
    @Inject(Services.WALLET_SERVICE)
    private readonly rmq_wallet_service: ClientProxy,
    @Inject(Services.INTEGRATION_SERVICE)
    private readonly rmq_integration_service: ClientProxy
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async createWallet(
    @UserId('id') currentUserId: ObjectId,
    @Body('wallet') createWalletDto: CreateWalletBodyDto
  ) {
    return await lastValueFrom(
      this.rmq_wallet_service.send({ cmd: Actions.CREATE_WALLET }, {
        userId: new ObjectId(currentUserId),
        ...createWalletDto,
      } as CreateWalletDto)
    );
  }

  @Post('fund/:walletId')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async fundWallet(
    @UserId('id') currentUserId: ObjectId,
    @Param() param: { walletId: ObjectId },
    @Body() body: { amount: number; currency: Currency }
  ) {
    return await lastValueFrom(
      this.rmq_wallet_service.send({ cmd: Actions.CREDIT_WALLET }, {
        senderId: currentUserId,
        walletId: param.walletId,
        amount: body.amount,
        currency: body.currency,
      } as CreditWalletDto)
    );
  }

  @Post('convert/:base/:target')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async convertFunds(
    @UserId('id') currentUserId: ObjectId,
    @Param() params: { base: Currency; target: Currency },
    @Body() convertWalletDto: ConvertWalletDto
  ) {
    const targetAmount = await lastValueFrom(
      this.rmq_integration_service.send(
        { cmd: Actions.EXCHANGE_AMOUNT },
        {
          base: params.base,
          target: params.target,
          amount: convertWalletDto.amount,
        }
      )
    );

    if (targetAmount.result !== 'success')
      return new HttpException(
        'Error Getting Amount, Try Again!!!',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    //debit the senderWallet
    const value = await lastValueFrom(
      this.rmq_wallet_service.send(
        { cmd: Actions.DEBIT_WALLET },
        {
          userId: currentUserId,
          currency: params.base,
          amount: convertWalletDto.amount,
        }
      )
    );

    //credit the receiving Wallet
    await lastValueFrom(
      this.rmq_wallet_service.send(
        {
          cmd: Actions.CREDIT_WALLET,
        },
        {
          senderId: currentUserId,
          walletId: convertWalletDto.receiverId,
          currency: params.target,
          amount: targetAmount.conversion_result,
        }
      )
    );

    //TODO: Add transaction Service
    return {
      error: false,
      message: 'Conversion Successful',
    };
  }
  //Transfer from one users wallet to another users wallet
  @Post('transfer/:base/:target')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async transferBetweenWallets(
    @UserId('id') currentUserId: ObjectId,
    @Param() params: { base: Currency; target: Currency },
    @Body() body: { amount: number; senderId: ObjectId }
  ) {
    const targetAmount: IRateAmount = await lastValueFrom(
      this.rmq_integration_service.send(
        { cmd: Actions.EXCHANGE_AMOUNT },
        {
          base: params.base,
          target: params.target,
          amount: body.amount,
        }
      )
    );
    if (targetAmount.result !== 'success')
      return new HttpException(
        'Error Getting Amount, Try Again!!!',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    //debit the senderWallet
    await lastValueFrom(
      this.rmq_wallet_service.send(
        { cmd: Actions.DEBIT_WALLET },
        {
          userId: currentUserId,
        }
      )
    );
  }

  @Get('')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getUserWallets(@UserId('id') currentUserId: ObjectId) {
    return this.rmq_wallet_service.send(
      { cmd: Actions.GET_ALL_WALLETS },
      {
        userId: currentUserId,
      }
    );
  }
}

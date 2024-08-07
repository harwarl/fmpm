import { Actions, IRateAmount, Services } from '@fmpm/constants';
import { UserId } from '@fmpm/decorators';
import {
  ConvertWalletDto,
  CreateWalletBodyDto,
  CreateWalletDto,
  CreditWalletDto,
  Currency,
  SaveTransactionDto,
} from '@fmpm/dtos';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';
import { OrderStatus, User, Wallet } from '@fmpm/models';
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
import { query } from 'express';
import { ObjectId } from 'mongodb';
import { lastValueFrom } from 'rxjs';

@Controller('wallets')
export class WalletController {
  constructor(
    @Inject(Services.WALLET_SERVICE)
    private readonly rmq_wallet_service: ClientProxy,
    @Inject(Services.INTEGRATION_SERVICE)
    private readonly rmq_integration_service: ClientProxy,
    @Inject(Services.AUTH_SERVICE)
    private readonly rmq_auth_service: ClientProxy,
    @Inject(Services.TRANSACTION_ORDER_SERVICE)
    private readonly rmq_transaction_service: ClientProxy
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
    const fundResponse = await lastValueFrom(
      this.rmq_wallet_service.send({ cmd: Actions.CREDIT_WALLET }, {
        senderId: currentUserId,
        walletId: param.walletId,
        amount: body.amount,
        currency: body.currency,
      } as CreditWalletDto)
    );

    if (fundResponse.status && fundResponse.name === 'HttpException') {
      return {
        error: true,
        message: `${fundResponse.message}`,
      };
    }

    return await lastValueFrom(
      this.rmq_transaction_service.send({ cmd: Actions.SAVE_TRANSACTION }, {
        userId: currentUserId.toString(),
        walletId: param.walletId.toString(),
        type: 'credit',
        amount: body.amount,
        currency: body.currency,
        metadata: JSON.stringify({ type: 'transfer' }),
        status: OrderStatus.COMPLETED,
      } as SaveTransactionDto)
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
    const debitResponse = await lastValueFrom(
      this.rmq_wallet_service.send(
        { cmd: Actions.DEBIT_WALLET },
        {
          userId: currentUserId,
          currency: params.base,
          amount: convertWalletDto.amount,
        }
      )
    );

    await lastValueFrom(
      this.rmq_transaction_service.send({ cmd: Actions.SAVE_TRANSACTION }, {
        userId: currentUserId.toString(),
        walletId: convertWalletDto.senderId,
        type: 'debit',
        amount: convertWalletDto.amount,
        currency: params.base,
        metadata: JSON.stringify({
          type: 'conversion',
          base: params.base,
          target: params.target,
        }),
        status: OrderStatus.COMPLETED,
      } as SaveTransactionDto)
    );

    if (debitResponse.status && debitResponse.name === 'HttpException') {
      return {
        error: true,
        message: `${debitResponse.message}`,
      };
    }
    //credit the receiving Wallet
    const creditResponse = await lastValueFrom(
      this.rmq_wallet_service.send(
        {
          cmd: Actions.CREDIT_WALLET,
        },
        {
          senderId: currentUserId,
          currency: params.target,
          amount: targetAmount.conversion_result,
        }
      )
    );
    if (creditResponse.status && creditResponse.name === 'HttpException') {
      this.rmq_wallet_service.send(
        { cmd: Actions.CREDIT_WALLET },
        {
          senderId: currentUserId,
          currency: params.base,
          amount: convertWalletDto.amount,
        }
      );

      return {
        error: true,
        message: `${creditResponse.message}, Transaction Reversed`,
      };
    }

    await lastValueFrom(
      this.rmq_transaction_service.send({ cmd: Actions.SAVE_TRANSACTION }, {
        userId: currentUserId.toString(),
        walletId: convertWalletDto.receiverId,
        type: 'credit',
        amount: targetAmount.conversion_result,
        currency: params.target,
        metadata: JSON.stringify({
          type: 'conversion',
          base: params.base,
          target: params.target,
        }),
        status: OrderStatus.COMPLETED,
      } as SaveTransactionDto)
    );

    return {
      error: false,
      message: 'Conversion Successful',
      wallet: debitResponse,
    };
  }
  //Transfer from one users wallet to another users wallet
  @Post('transfer/:receiver')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async transferBetweenWallets(
    @UserId('id') currentUserId: ObjectId,
    @Param() params: { receiver: string },
    @Body() body: { amount: number; currency: Currency }
  ) {
    // flow
    /**
     * Find Sender By UserName and get the Id, do the same for receiver ans throw errors if they dont.
     * debit the sender and save the transaction.
     * credit the receiver
     */
    const receiverDetails: User = await lastValueFrom(
      this.rmq_auth_service.send(
        { cmd: Actions.Get_USER_BY_USERNAME },
        { username: params.receiver }
      )
    );

    if (!receiverDetails)
      return {
        error: true,
        message: `User with Username ${params.receiver} does not exist`,
      };

    //debit the sender
    const debitResponse = await lastValueFrom(
      this.rmq_wallet_service.send(
        { cmd: Actions.DEBIT_WALLET },
        {
          userId: currentUserId,
          currency: body.currency,
          amount: body.amount,
        }
      )
    );

    if (debitResponse.status && debitResponse.name === 'HttpException') {
      return {
        error: true,
        message: `${debitResponse.message}`,
      };
    }

    await lastValueFrom(
      this.rmq_transaction_service.send({ cmd: Actions.SAVE_TRANSACTION }, {
        userId: currentUserId.toString(),
        walletId: debitResponse._id,
        type: 'debit',
        amount: body.amount,
        currency: body.currency,
        metadata: JSON.stringify({
          type: 'transfer',
        }),
        status: OrderStatus.COMPLETED,
      } as SaveTransactionDto)
    );

    //Add transaction Details Here
    //Credit the receiver
    const creditResponse = await lastValueFrom(
      this.rmq_wallet_service.send(
        {
          cmd: Actions.CREDIT_WALLET,
        },
        {
          senderId: receiverDetails._id,
          currency: body.currency,
          amount: body.amount,
        }
      )
    );
    if (creditResponse.status && creditResponse.name === 'HttpException') {
      this.rmq_wallet_service.send(
        { cmd: Actions.CREDIT_WALLET },
        {
          senderId: currentUserId,
          currency: body.currency,
          amount: body.amount,
        }
      );

      await lastValueFrom(
        this.rmq_transaction_service.send({ cmd: Actions.SAVE_TRANSACTION }, {
          userId: currentUserId.toString(),
          walletId: debitResponse._id,
          type: 'credit',
          amount: body.amount,
          currency: body.currency,
          metadata: JSON.stringify({
            type: 'transfer',
          }),
          status: OrderStatus.COMPLETED,
        } as SaveTransactionDto)
      );
      return {
        error: true,
        message: `${creditResponse.message} , Transaction Reversed`,
      };
    }

    await lastValueFrom(
      this.rmq_transaction_service.send({ cmd: Actions.SAVE_TRANSACTION }, {
        userId: receiverDetails._id.toString(),
        walletId: creditResponse._id,
        type: 'credit/Reversal',
        amount: body.amount,
        currency: body.currency,
        metadata: JSON.stringify({
          type: 'transfer',
        }),
        status: OrderStatus.COMPLETED,
      } as SaveTransactionDto)
    );

    return {
      error: false,
      message: `${body.amount} ${body.currency} transferred successfully`,
    };
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

import { Actions, Services } from '@fmpm/constants';
import { UserId } from '@fmpm/decorators';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';
import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { lastValueFrom } from 'rxjs';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(Services.TRANSACTION_ORDER_SERVICE)
    private readonly rmq_transaction_service: ClientProxy
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getAlltransactions(
    @UserId('id') currentUserId: ObjectId,
    @Query() query: { limit?: string; page?: string }
  ) {
    return await lastValueFrom(
      this.rmq_transaction_service.send(
        { cmd: Actions.GET_ALL_TRANSACTION },
        {
          limit: query.limit ? Number(query.limit) : 10,
          page: query.page ? Number(query.page) : 1,
          userId: currentUserId.toString(),
        }
      )
    );
  }
}

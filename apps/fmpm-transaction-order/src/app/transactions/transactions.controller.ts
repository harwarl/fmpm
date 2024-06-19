import { Controller } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { GetTransactionsFilterDto, SaveTransactionDto } from '@fmpm/dtos';
import { RabbitMQService } from '@fmpm/modules';
import { Actions } from '@fmpm/constants';

@Controller()
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly rabbitMqService: RabbitMQService
  ) {}

  @MessagePattern({ cmd: Actions.SAVE_TRANSACTION })
  async saveTransaction(
    @Ctx() context: RmqContext,
    @Payload() saveTransactionDto: SaveTransactionDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.transactionsService.saveTransaction(saveTransactionDto);
  }

  @MessagePattern({
    cmd: Actions.GET_ALL_TRANSACTION,
  })
  async getAllTransactions(
    @Ctx() context: RmqContext,
    @Payload() getTransactionFilterDto: GetTransactionsFilterDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.transactionsService.getAllTransactions(
      getTransactionFilterDto
    );
  }
}

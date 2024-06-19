import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { RabbitMQModule } from '@fmpm/modules';
import { Queues, Services } from '@fmpm/constants';

@Module({
  imports: [
    RabbitMQModule.registerRmq(
      Services.TRANSACTION_ORDER_SERVICE,
      Queues.TRANSACTION_ORDER_QUEUE
    ),
    RabbitMQModule.registerRmq(Services.AUTH_SERVICE, Queues.AUTH_QUEUE),
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}

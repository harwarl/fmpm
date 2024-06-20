import { Queues, Services } from '@fmpm/constants';
import { RabbitMQModule } from '@fmpm/modules';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';

@Module({
  imports: [
    RabbitMQModule.registerRmq(
      Services.TRANSACTION_ORDER_SERVICE,
      Queues.TRANSACTION_ORDER_QUEUE
    ),
    RabbitMQModule.registerRmq(Services.AUTH_SERVICE, Queues.AUTH_QUEUE),
  ],
  controllers: [OrderController],
  providers: [],
})
export class OrderModule {}

import { Queues, Services } from '@fmpm/constants';
import { RabbitMQModule } from '@fmpm/modules';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { MarketModule } from '../market/market.module';
import { OrderService } from './order.service';
import { MarketService } from '../market/market.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    RabbitMQModule.registerRmq(
      Services.TRANSACTION_ORDER_SERVICE,
      Queues.TRANSACTION_ORDER_QUEUE
    ),
    RabbitMQModule.registerRmq(Services.AUTH_SERVICE, Queues.AUTH_QUEUE),
    RabbitMQModule.registerRmq(Services.WALLET_SERVICE, Queues.WALLET_QUEUE),
    ClientsModule.register([
      {
        name: Services.GRPC_RATE_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'rate',
          protoPath: join(__dirname, '../proto/rate.proto'),
        },
      },
    ]),
    MarketModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, MarketService],
})
export class OrderModule {
  constructor(private orderService: OrderService) {
    this.scheduleOrderChecks();
  }

  async scheduleOrderChecks() {
    setInterval(async () => {
      await this.orderService.executeOrders();
    }, 12000);
  }
}

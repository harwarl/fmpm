import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongoModule, RabbitMQModule } from '@fmpm/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderTransactions } from '@fmpm/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderTransactions, Order]),
    RabbitMQModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

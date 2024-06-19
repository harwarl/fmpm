import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateOrderDto, DeleteOrderDto, UpdateOrderDto } from '@fmpm/dtos';
import { RabbitMQService } from '@fmpm/modules';
import { Actions } from '@fmpm/constants';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rabbitMqService: RabbitMQService
  ) {}

  @MessagePattern({ cmd: Actions.CREATE_ORDER })
  async createOrder(
    @Ctx() context: RmqContext,
    @Payload() createOrderDto: CreateOrderDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: Actions.UPDATE_ORDER })
  async updateOrder(
    @Ctx() context: RmqContext,
    @Payload() updateOrderDto: UpdateOrderDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.updateOrder(updateOrderDto);
  }

  @MessagePattern({ cmd: Actions.DELETE_ORDER })
  async DeleteOrderDto(
    @Ctx() context: RmqContext,
    @Payload() deleteOrderDto: DeleteOrderDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.deleteOrder(deleteOrderDto);
  }
}

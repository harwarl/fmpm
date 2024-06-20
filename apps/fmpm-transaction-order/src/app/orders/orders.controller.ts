import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  CreateOrderDto,
  CreateOrderPayloadDto,
  DeleteOrderDto,
  GetTransactionsFilterDto,
  UpdateOrderDto,
  UpdateOrderPayloadDto,
} from '@fmpm/dtos';
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
    @Payload() createOrderDto: CreateOrderPayloadDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.createOrder(createOrderDto);
  }

  @MessagePattern({ cmd: Actions.UPDATE_ORDER })
  async updateOrder(
    @Ctx() context: RmqContext,
    @Payload() updateOrderDto: UpdateOrderPayloadDto
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

  @MessagePattern({ cmd: Actions.GET_ALL_ORDERS })
  async getAllOrders(
    @Ctx() context: RmqContext,
    @Payload() getOrderFilter: GetTransactionsFilterDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.ordersService.getAllOrders(getOrderFilter);
  }
}

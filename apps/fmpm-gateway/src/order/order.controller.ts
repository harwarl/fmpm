import { Actions, Services } from '@fmpm/constants';
import { UserId } from '@fmpm/decorators';
import {
  CreateOrderDto,
  CreateOrderPayloadDto,
  DeleteOrderDto,
  UpdateOrderDto,
  UpdateOrderPayloadDto,
} from '@fmpm/dtos';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { lastValueFrom } from 'rxjs';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject(Services.TRANSACTION_ORDER_SERVICE)
    private readonly rmq_order_service: ClientProxy
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getAllOrders(
    @UserId('id') currentUserId: ObjectId,
    @Query() query: { limit?: string; page?: string }
  ) {
    return await lastValueFrom(
      this.rmq_order_service.send(
        {
          cmd: Actions.GET_ALL_ORDERS,
        },
        {
          limit: query.limit ? Number(query.limit) : 10,
          page: query.page ? Number(query.page) : 1,
          userId: currentUserId.toString(),
        }
      )
    );
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async createOrder(
    @UserId('id') currentUserId: string,
    @Body('order') createOrderDto: CreateOrderDto
  ) {
    const createOrderResponse = await lastValueFrom(
      this.rmq_order_service.send(
        {
          cmd: Actions.CREATE_ORDER,
        },
        {
          userId: currentUserId,
          ...createOrderDto,
        } as CreateOrderPayloadDto
      )
    );
    return createOrderResponse;
  }

  @Put('/:orderId')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async updateOrder(
    @UserId('id') currentUserId: string,
    @Param('orderId') orderId: string,
    @Body('order') updateOrderDto: UpdateOrderDto
  ) {
    const updateOrderResponse = await lastValueFrom(
      this.rmq_order_service.send(
        {
          cmd: Actions.UPDATE_ORDER,
        },
        {
          orderId: orderId,
          ...updateOrderDto,
        } as UpdateOrderPayloadDto
      )
    );
    return updateOrderResponse;
  }

  @Delete('/:orderId')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async deleteOrder(
    @UserId('id') currentUserId: string,
    @Param('orderId') orderId: string
  ) {
    const deleteOrderResponse = await lastValueFrom(
      this.rmq_order_service.send(
        {
          cmd: Actions.DELETE_ORDER,
        },
        {
          orderId: orderId,
        } as DeleteOrderDto
      )
    );
    return deleteOrderResponse;
  }
}

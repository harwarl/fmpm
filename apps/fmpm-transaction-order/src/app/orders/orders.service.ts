import {
  CreateOrderDto,
  DeleteOrderDto,
  GetTransactionsFilterDto,
  UpdateOrderDto,
  UpdateOrderPayloadDto,
} from '@fmpm/dtos';
import { Order, OrderStatus } from '@fmpm/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = new Order();
    Object.assign(newOrder, { status: OrderStatus.PENDING, ...createOrderDto });
    return await this.orderRepository.save(newOrder);
  }

  async updateOrder(updateOrderDto: UpdateOrderPayloadDto) {
    const order = await this.getOrderById(updateOrderDto.orderId);

    if (!order)
      return new HttpException('Order does not exist', HttpStatus.BAD_REQUEST);

    Object.assign(order, _.omit(updateOrderDto, 'orderId'));
    return await this.orderRepository.save(order);
  }

  async deleteOrder(deleteOrderDto: DeleteOrderDto) {
    const order = await this.getOrderById(deleteOrderDto.orderId);

    if (!order)
      return new HttpException('Order does not exist', HttpStatus.BAD_REQUEST);

    Object.assign(order, { status: OrderStatus.CANCELLED });
    return await this.orderRepository.save(order);
  }

  async getAllOrders(
    getOrderFilter: GetTransactionsFilterDto
  ): Promise<Order[]> {
    const limit = getOrderFilter.limit ? getOrderFilter.limit : 10;
    const page = getOrderFilter.page ? getOrderFilter.page : 1;

    return await this.orderRepository.find({
      where: {
        userId: getOrderFilter.userId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        _id: new ObjectId(orderId),
      },
    });
    return order;
  }
}

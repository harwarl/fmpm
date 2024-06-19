import { CreateOrderDto, DeleteOrderDto, UpdateOrderDto } from '@fmpm/dtos';
import { Order } from '@fmpm/models';
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
    Object.assign(newOrder, createOrderDto);
    return await this.orderRepository.save(newOrder);
  }

  async updateOrder(updateOrderDto: UpdateOrderDto) {
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

    return await this.orderRepository.delete(
      new ObjectId(deleteOrderDto.orderId)
    );
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

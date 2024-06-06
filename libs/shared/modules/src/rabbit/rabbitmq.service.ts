import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { RabbitMQServiceInterface } from './rabbitmq.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQService implements RabbitMQServiceInterface {
  constructor(private readonly configService: ConfigService) {}

  getRmqOptions(queue: string): RmqOptions {
    const RABBITMQ_URL = this.configService.get('RABBITMQ_URL');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const URL = configService.get('RABBITMQ_URL');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [URL],
              queue,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];

    return {
      module: RabbitMQModule,
      providers,
      exports: providers,
    };
  }
}

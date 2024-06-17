import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RabbitMQService } from '@fmpm/modules'; // Adjust the import path
import { Queues } from '@fmpm/constants';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService);
  const rabbitMQService = app.get(RabbitMQService);

  const port = configService.get<number>('AUTH_PORT');
  app.connectMicroservice(rabbitMQService.getRmqOptions(Queues.AUTH_QUEUE));

  await app.startAllMicroservices();

  await app.listen(port);
  Logger.log(`
    🚀 Transaction Service is running on: http://localhost:${port}/${globalPrefix}
    `);
}

bootstrap();

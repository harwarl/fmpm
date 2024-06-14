import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RabbitMQService } from '@fmpm/modules'; // Adjust the import path
import { Queues } from '@fmpm/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rabbitMQService = app.get(RabbitMQService);

  app.connectMicroservice(rabbitMQService.getRmqOptions(Queues.AUTH_QUEUE));
  await app.startAllMicroservices();

  await app.listen(configService.get('AUTH_PORT'));
}

bootstrap();

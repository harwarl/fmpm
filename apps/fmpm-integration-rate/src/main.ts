/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from '@fmpm/modules';
import { Queues } from '@fmpm/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const rabbitMQService = app.get(RabbitMQService);

  app.connectMicroservice(
    rabbitMQService.getRmqOptions(Queues.INTEGRATION_QUEUE)
  );
  await app.startAllMicroservices();

  await app.listen(configService.get('PORT'));
}

bootstrap();

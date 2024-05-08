/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GLOBAL_API_PREFIX } from '@fmpm/constants';
import { ConfigService } from '@fmpm/config';

const port = new ConfigService().get().port;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_API_PREFIX);
  await app.listen(port);
  Logger.log('Inhere boss');
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_API_PREFIX}`
  );
}

bootstrap();

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RabbitMQModule } from '@fmpm/modules';
import { Queues, Services } from '@fmpm/constants';
import { UserController } from '../user/user.controller';

@Module({
  imports: [
    RabbitMQModule.registerRmq(Services.AUTH_SERVICE, Queues.AUTH_QUEUE),
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class AuthModule {}

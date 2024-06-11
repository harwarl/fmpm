import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RabbitMQModule } from '@fmpm/modules';
import { Queues, Services } from '@fmpm/constants';
import { UserController } from '../user/user.controller';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    RabbitMQModule.registerRmq(Services.AUTH_SERVICE, Queues.AUTH_QUEUE),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const mailHost = configService.get<string>('MAIL_HOST');
        const mailPort = configService.get<number>('MAIL_PORT');
        const mailUser = configService.get<string>('MAIL_USER');
        const mailPass = configService.get<string>('MAIL_PASS');

        return {
          transport: {
            host: mailHost,
            port: mailPort,
            secure: mailPort === 465,
            auth: {
              user: mailUser,
              pass: mailPass,
            },
          },
          defaults: {
            from: 'No Reply <harwarl87@gmail.com>',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class AuthModule {}

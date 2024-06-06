import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@fmpm/models';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from '@fmpm/helpers';
import { RabbitMQModule } from '@fmpm/modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'Alaba the man',
      signOptions: { expiresIn: '30m' },
    }),
    RabbitMQModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}

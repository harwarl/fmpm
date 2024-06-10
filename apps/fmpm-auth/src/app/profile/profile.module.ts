import { RabbitMQModule } from '@fmpm/modules';
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@fmpm/models';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptService } from '@fmpm/helpers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RabbitMQModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, BcryptService],
})
export class ProfileModule {}

import { RabbitMQModule } from '@fmpm/modules';
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@fmpm/models';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RabbitMQModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

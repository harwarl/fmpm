import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../entity/user.entity';
import { User } from '@fmpm/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@fmpm/helpers';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtService, BcryptService],
  exports: [UserService],
})
export class UserModule {}

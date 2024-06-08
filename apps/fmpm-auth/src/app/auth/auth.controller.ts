import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '@fmpm/dtos';
import { IUserResponse } from '../types/userResponse.interface';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Actions } from '@fmpm/constants';
import { RabbitMQService } from '@fmpm/modules';
import { ObjectId } from 'typeorm';
import { User } from '@fmpm/models';
// import { }

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rabbitMqService: RabbitMQService
  ) {}

  @MessagePattern({ cmd: Actions.CREATE_USER })
  async createUser(
    @Ctx() context: RmqContext,
    @Payload() createUserDto: CreateUserDto
  ): Promise<IUserResponse> {
    this.rabbitMqService.acknowledgeMessage(context);
    const user = await this.authService.createUser(createUserDto);
    delete user.password;
    return this.authService.buildUserTokenResponse(user);
  }

  @MessagePattern({ cmd: Actions.LOGIN_USER })
  async loginUser(
    @Ctx() context: RmqContext,
    @Payload() loginUserDto: LoginUserDto
  ): Promise<IUserResponse> {
    this.rabbitMqService.acknowledgeMessage(context);
    const user = await this.authService.loginUser(loginUserDto);
    return this.authService.buildUserTokenResponse(user);
  }

  @MessagePattern({ cmd: Actions.GET_USER })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() user: { id: ObjectId }
  ): Promise<User> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.authService.findById(user.id);
  }

  @MessagePattern({ cmd: Actions.VERIFY_JWT })
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string }
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.authService.verifyJwt(payload.jwt);
  }

  @MessagePattern({ cmd: Actions.DECODE_JWT })
  async decodeJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string }
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.authService.decodeJwt(payload.jwt);
  }
}

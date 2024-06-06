import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@fmpm/dtos';
import { ClientProxy } from '@nestjs/microservices';
import { Actions, Services } from '@fmpm/constants';
import { lastValueFrom, timeout } from 'rxjs';
import { UserId } from '@fmpm/decorators';
import { ObjectId } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(Services.AUTH_SERVICE)
    private readonly rmq_auth_client: ClientProxy
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  createUser(@Body('user') createUserDto: CreateUserDto) {
    const val = this.rmq_auth_client
      .send<string, CreateUserDto>({ cmd: Actions.CREATE_USER }, createUserDto)
      .pipe(timeout(5000));
    console.log(val);
    return val;
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  loginUser(@Body('user') loginUserDto: LoginUserDto) {
    return lastValueFrom(
      this.rmq_auth_client
        .send<string, LoginUserDto>(
          {
            cmd: Actions.LOGIN_USER,
          },
          loginUserDto
        )
        .pipe(timeout(5000))
    );
  }

  @Post('update')
  @UsePipes(new ValidationPipe())
  update(
    @Body('user') updateUserDto: UpdateUserDto,
    @UserId() currentUserId: string
  ) {
    return this.rmq_auth_client
      .send<string, UpdateUserDto>(
        { cmd: Actions.UPDATE_USER },
        { currentUserId, ...updateUserDto }
      )
      .pipe(timeout(5000));
  }

  @Get('me')
  getMe(@UserId() currentUserId: ObjectId) {
    return this.rmq_auth_client
      .send<string, any>({ cmd: Actions.GET_USER }, currentUserId)
      .pipe(timeout(5000));
  }
}

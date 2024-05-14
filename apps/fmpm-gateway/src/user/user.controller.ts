import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@fmpm/dtos';
import { ClientProxy } from '@nestjs/microservices';
import { Actions, Services } from '@fmpm/constants';
import { timeout } from 'rxjs';
import { AuthGuard } from '@fmpm/guards';
import { User } from '@fmpm/decorators';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Services.AUTH_SERVICE) private rmq_auth_client: ClientProxy
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  createUser(@Body('user') createUserDto: CreateUserDto) {
    return this.rmq_auth_client
      .send<string, CreateUserDto>({ cmd: Actions.CREATE_USER }, createUserDto)
      .pipe(timeout(5000));
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  loginUser(@Body('user') loginUserDto: LoginUserDto) {
    console.log({ loginUserDto });
    return this.rmq_auth_client
      .send<string, LoginUserDto>(
        {
          cmd: Actions.LOGIN_USER,
        },
        loginUserDto
      )
      .pipe(timeout(5000));
  }

  @Post('update')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  update(
    @Body('user') updateUserDto: UpdateUserDto,
    @User('id') currentUserId: string
  ) {
    
    return this.rmq_auth_client
      .send<string, UpdateUserDto>(
        { cmd: Actions.UPDATE_USER },
        { currentUserId, ...updateUserDto }
      )
      .pipe(timeout(5000));
  }
}

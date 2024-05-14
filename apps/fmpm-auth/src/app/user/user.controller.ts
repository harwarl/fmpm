import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto, LoginUserDto } from '../dto';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '@fmpm/dtos';
import { IUserResponse } from '../types/userResponse.interface';
import { AuthGuard } from '@fmpm/guards';
import { User } from '@fmpm/decorators';
import { User as UserEntity } from '@fmpm/models';
import { MessagePattern } from '@nestjs/microservices';
import { Actions } from '@fmpm/constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: Actions.CREATE_USER })
  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);
    delete user.password;
    return this.userService.buildUserTokenResponse(user);
  }

  @MessagePattern({ cmd: Actions.LOGIN_USER })
  async loginUser(loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserTokenResponse(user);
  }

  @MessagePattern({ cmd: Actions.LOGIN_USER })
  async updateUser(updateUserDto: UpdateUserDto): Promise<IUserResponse> {
    const user = await this.userService.updateUser(
      updateUserDto.currentUserId,
      updateUserDto
    );
    return this.userService.buildUserTokenResponse(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getUser(@User() currentUser: UserEntity): Promise<UserEntity> {
    return currentUser;
  }
}

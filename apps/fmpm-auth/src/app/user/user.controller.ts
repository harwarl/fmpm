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
import { CreateUserDto, LoginUserDto } from '../dto';
import { IUserResponse } from '../types/userResponse.interface';
import { AuthGuard } from '@fmpm/guards';
import { User } from '@fmpm/decorators';
import { User as UserEntity } from '@fmpm/models';
import { ObjectId } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);
    delete user.password;
    return this.userService.buildUserTokenResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto
  ): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserTokenResponse(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getUser(@User() currentUser: UserEntity): Promise<UserEntity> {
    return currentUser;
  }
}

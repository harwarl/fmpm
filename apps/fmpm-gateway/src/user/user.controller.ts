import { Actions, Services } from '@fmpm/constants';
import { UserId } from '@fmpm/decorators';
import { UpdateUserDto, UpdateUserPayload } from '@fmpm/dtos';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';
import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ObjectId } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly rmq_auth_client: ClientProxy
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getMe(@UserId('id') currentUserId: ObjectId) {
    const res = await lastValueFrom(
      this.rmq_auth_client.send(
        { cmd: Actions.GET_USER },
        { currentUserId: currentUserId }
      )
    );

    console.log('EWEEEE');
    return res;
  }

  @Patch('update')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async updateUser(
    @UserId('id') currentUserId: ObjectId,
    @Body('user') updateUserDto: UpdateUserDto
  ) {
    const payload = {
      currentUserId: currentUserId,
      ...updateUserDto,
    };

    const res = await lastValueFrom(
      this.rmq_auth_client.send({ cmd: Actions.UPDATE_USER }, payload)
    );

    console.log('OMOOOOO');
    console.log(res);

    return res;
  }
}

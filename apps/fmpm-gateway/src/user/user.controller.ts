import { Actions, Services } from '@fmpm/constants';
import { UserId } from '@fmpm/decorators';
import { UpdateUserDto } from '@fmpm/dtos';
import { AuthGuard } from '@fmpm/guards';
import { UserInteceptor } from '@fmpm/inteceptors';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { ObjectId } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    @Inject(Services.AUTH_SERVICE)
    private readonly rmq_auth_client: ClientProxy,
    private readonly mailerService: MailerService
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async getMe(@UserId('id') currentUserId: ObjectId) {
    return await lastValueFrom(
      this.rmq_auth_client.send(
        { cmd: Actions.GET_USER },
        { currentUserId: currentUserId }
      )
    );
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
    return await lastValueFrom(
      this.rmq_auth_client
        .send({ cmd: Actions.UPDATE_USER }, payload)
        .pipe(timeout(10000))
    );
  }

  @Post('new-password')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInteceptor)
  async changePassword(
    @UserId('id') currentUserId: ObjectId,
    @Body() changePasswordDto: { password: string }
  ) {
    const res = await lastValueFrom(
      this.rmq_auth_client
        .send(
          { cmd: Actions.CHANGE_PASSWORD },
          { currentUserId, ...changePasswordDto }
        )
        .pipe(timeout(40000))
    );
    await this.mailerService.sendMail({
      from: 'No Reply <Harwarl87@gmail.com>',
      to: res.email,
      subject: 'AJE',
      html: `<p>You Just changed Your password</p>`,
    });
    return res;
  }
}

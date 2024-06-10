import { Actions } from '@fmpm/constants';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProfileService } from './profile.service';
import { ObjectId } from 'typeorm';
import { RabbitMQService } from '@fmpm/modules';
import { ChangePasswordDto, UpdateUserPayload } from '@fmpm/dtos';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly rabbitMqService: RabbitMQService
  ) {}

  @MessagePattern({ cmd: Actions.GET_USER })
  async getUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { currentUserId: ObjectId }
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.profileService.getUser(payload.currentUserId);
  }

  @MessagePattern({ cmd: Actions.UPDATE_USER })
  async updateUser(
    @Ctx() context: RmqContext,
    @Payload() payload: UpdateUserPayload
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    const { currentUserId, ...updateUserDto } = payload;
    return this.profileService.updateUser(currentUserId, updateUserDto);
  }

  @MessagePattern({ cmd: Actions.CHANGE_PASSWORD })
  async changePassword(
    @Ctx() context: RmqContext,
    @Payload() changePasswordDto: ChangePasswordDto
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.profileService.changePassword(changePasswordDto);
  }
}

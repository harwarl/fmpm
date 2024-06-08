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
import { UpdateUserPayload } from '@fmpm/dtos';
import { UpdateUserDto } from '../dto';

@Controller('')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly rabbitMqService: RabbitMQService
  ) {}

  @MessagePattern({ cmd: Actions.GET_USER })
  async getUserProfile(
    @Ctx() context: RmqContext,
    @Payload() payload: { currentUserId: ObjectId }
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return await this.profileService.getUserProfile(payload.currentUserId);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUserProfile(
    @Ctx() context: RmqContext,
    @Payload() payload: UpdateUserPayload
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    const { currentUserId, ...updateUserDto } = payload;
    return this.profileService.updateUser(currentUserId, updateUserDto);
  }
}

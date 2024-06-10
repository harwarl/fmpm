import { User } from '@fmpm/models';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UpdateUserDto } from '../dto';
import { ObjectId } from 'mongodb';
import { ChangePasswordDto } from '@fmpm/dtos';
import { BcryptService } from '@fmpm/helpers';

export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly bcryptService: BcryptService
  ) {}

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.findUserById(changePasswordDto.currentUserId);
    const hashedPassword = await this.bcryptService.hashPassword(
      changePasswordDto.password
    );
    Object.assign(user, { password: hashedPassword });
    return await this.userRepository.save(user);
  }

  async getUser(currentUserId: ObjectId): Promise<User> {
    return await this.findUserById(currentUserId);
  }

  async updateUser(
    currentUserId: ObjectId,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.findUserById(currentUserId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async findUserById(id: ObjectId): Promise<User> {
    const userObejctId = new ObjectId(id);
    const user = await this.userRepository.findOne({
      where: {
        _id: userObejctId,
      },
    });
    return user;
  }
}

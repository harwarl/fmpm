import { User } from '@fmpm/models';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UpdateUserDto } from '../dto';
import { ObjectId } from 'mongodb';

export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>
  ) {}

  async getUserProfile(currentUserId: ObjectId): Promise<User> {
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

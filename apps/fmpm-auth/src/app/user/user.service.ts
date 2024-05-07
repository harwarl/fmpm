import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    return;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    return;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
    return;
  }
}

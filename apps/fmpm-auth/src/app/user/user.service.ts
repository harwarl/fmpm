import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from '../entity/user.entity';
import { MongoRepository } from 'typeorm';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { IUserResponse } from '../types/userResponse.interface';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
    private readonly JwtService: JwtService,
    private readonly helperService: HelperService
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or Username has already been taken',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const isPasswordValid = this.helperService.comparePassword(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
    delete user.password;
    return user;
  }

  async updateUser(
    currentUserId: ObjectId,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.findById(currentUserId);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async findById(id: ObjectId): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  generateJwt(user: UserEntity): string {
    return this.JwtService.sign({
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}

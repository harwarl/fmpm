import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from '@fmpm/models';
import { MongoRepository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { IUserResponse } from '../types/userResponse.interface';
import { BcryptService } from '@fmpm/helpers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
    private readonly JwtService: JwtService,
    private readonly bcryptService: BcryptService
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

    const isPasswordValid = this.bcryptService.comparePassword(
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

  async findById(id: ObjectId): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }
    try {
      const { user, exp } = await this.JwtService.verifyAsync(jwt);
      return { user, exp };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async decodeJwt(jwt: string): Promise<any> {
    if (!jwt) return;
    try {
      return this.JwtService.decode(jwt);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  validateUser(token: string) {
    try {
      return this.JwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  generateJwt(user: UserEntity): string {
    return this.JwtService.sign({
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }

  buildUserTokenResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}

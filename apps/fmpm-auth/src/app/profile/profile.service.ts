import { User } from '@fmpm/models';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>
  ) {}
}

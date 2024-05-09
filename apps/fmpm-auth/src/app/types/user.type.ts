// import { User } from '../entity/user.entity';
import { User } from '@fmpm/models';

export type UserType = Omit<User, 'hashPassword'>;

import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

/**
 * This helper service contain bcrypt functions
 */
@Injectable()
export class BcryptService {
  private saltRounds: number;
  constructor() {
    this.saltRounds = 10;
  }

  async generateSalt() {
    return genSaltSync(this.saltRounds);
  }

  async hashPassword(password: string) {
    const saltSync = await this.generateSalt();
    return hashSync(password, saltSync);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }
}

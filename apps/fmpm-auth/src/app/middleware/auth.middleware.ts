import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '@fmpm/interfaces';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
//Auth Middleware
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly JwtService: JwtService
  ) {}
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = this.JwtService.verify(token, {
        secret: 'Alade of Egba Land',
      });
      if (typeof decoded === 'object' && 'id' in decoded) {
        const user = await this.userService.findById(decoded.id);
        req.user = user;
      } else {
        req.user = null;
      }
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}

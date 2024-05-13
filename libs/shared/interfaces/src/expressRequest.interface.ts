import { User } from '@fmpm/models';
import { Request } from 'express';

export interface ExpressRequest extends Request {
  user?: User;
}

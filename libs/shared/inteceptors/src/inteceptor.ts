import { Actions, Services } from '@fmpm/constants';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, switchMap } from 'rxjs';

@Injectable()
export class UserInteceptor implements NestInterceptor {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authService: ClientProxy
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    if (context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return next.handle();

    const authHeadeParts = authHeader.split(' ');
    if (authHeadeParts.length !== 2) return next.handle();

    const [, jwt] = authHeadeParts;
    return this.authService.send({ cmd: Actions.DECODE_JWT }, { jwt }).pipe(
      switchMap(({ user }) => {
        request.user = user;
        return next.handle();
      }),
      catchError(() => next.handle())
    );
  }
}

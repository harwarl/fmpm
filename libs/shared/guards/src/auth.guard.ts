import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Actions, Services } from '@fmpm/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authService: ClientProxy
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') return false;

    const request = context.switchToHttp().getRequest();
    const authheader = request.headers['authorization'];

    if (!authheader) return false;

    const authHeaderParts = (authheader as string).split(' ');
    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;

    return this.authService.send({ cmd: Actions.VERIFY_JWT }, { jwt }).pipe(
      switchMap(({ exp }) => {
        if (!exp) return of(false);

        const TOKEN_EXP_MS = exp * 1000;

        const isJWTValid = Date.now() < TOKEN_EXP_MS;

        return of(isJWTValid);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      })
    );
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.id) {
      null;
    }
    // if (data) {
    //   return request.user[data];
    // }
    return request.id;
  }
);

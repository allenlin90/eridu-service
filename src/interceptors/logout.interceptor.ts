import type { Response } from 'express';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor() {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const res = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      finalize(() => {
        this.clearRefreshTokenCookie(res);

        return null;
      }),
    );
  }

  private clearRefreshTokenCookie(res: Response) {
    res.cookie('refreshToken', null, {
      expires: new Date(0),
      maxAge: 0,
    });
  }
}

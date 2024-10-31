import type { Response } from 'express';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor(private config: ConfigService) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const res = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map(() => {
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

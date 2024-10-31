import type { Response } from 'express';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

import { ConfigKeys } from '../config';
import { RefreshToken } from '@prisma/client';

interface Tokens {
  accessToken: string;
  refreshToken: RefreshToken;
}

@Injectable()
export class AuthTokensInterceptor implements NestInterceptor {
  constructor(private config: ConfigService) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const res = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map(({ accessToken, refreshToken }: Tokens) => {
        this.setRefreshTokenCookie(res, refreshToken);

        return { accessToken };
      }),
    );
  }

  private setRefreshTokenCookie(res: Response, refreshToken: RefreshToken) {
    res.cookie('refreshToken', refreshToken.uid, {
      httpOnly: true,
      sameSite: 'none', // required when client is on a different domain
      expires: refreshToken.expiryDate,
      secure: this.config.get(ConfigKeys.IS_PRODUCTION),
    });
  }
}

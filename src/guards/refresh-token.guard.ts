import type { Request } from 'express';
import type { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

declare global {
  namespace Express {
    interface Request {
      refreshToken?: string | null;
    }
  }
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken = this.getRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('invalid refresh token');
    }

    request.refreshToken = refreshToken;

    return true;
  }

  private getRefreshToken(request: Request): string | undefined {
    return request.cookies?.refreshToken;
  }
}

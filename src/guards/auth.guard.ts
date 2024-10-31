import type { Request } from 'express';
import type { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

declare global {
  namespace Express {
    interface Request {
      userId?: string | null;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessToken(request);

    if (!accessToken) {
      throw new UnauthorizedException('invalid access token');
    }

    try {
      const payload = this.jwtService.verify(accessToken);
      request.userId = payload.userId;
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException('invalid access token');
    }

    return true;
  }

  private extractAccessToken(request: Request): string | undefined {
    return request.headers['authorization']?.split(' ')[1];
  }
}

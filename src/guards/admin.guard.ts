import type { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '@/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.userId) {
      throw new UnauthorizedException('invalid credentials');
    }

    // TODO: optimize this to avoid database query and balance performance and security
    const user = await this.userService.findOne({ uid: request.userId });

    if (!user) {
      throw new ForbiddenException('invalid user');
    }

    return user.isAdmin;
  }
}

import { Injectable } from '@nestjs/common';

import { HandlePrismaNotFoundError } from '@/decorators/prisma-not-found-error.decorator';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  get findUniqueRefreshToken() {
    return this.prisma.refreshToken.findUnique;
  }

  get createResetToken() {
    return this.prisma.resetToken.create;
  }

  get createRefreshToken() {
    return this.prisma.refreshToken.create;
  }

  @HandlePrismaNotFoundError()
  get deleteRefreshToken() {
    return this.prisma.refreshToken.delete;
  }

  @HandlePrismaNotFoundError()
  get deleteResetToken() {
    return this.prisma.resetToken.delete;
  }
}

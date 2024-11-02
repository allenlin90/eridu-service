import { Injectable } from '@nestjs/common';

import { Prisma, RefreshToken, ResetToken } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { HandlePrismaNotFoundError } from '@/decorators/prisma-not-found-error.decorator';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findUniqueRefreshToken(
    refreshTokenUid: string,
  ): Promise<Prisma.RefreshTokenGetPayload<{ include: { user: true } }>> {
    return this.prisma.refreshToken.findUnique({
      where: { uid: refreshTokenUid, expiryDate: { gte: new Date() } },
      include: { user: true },
    });
  }

  async createRefreshToken(
    data: Prisma.RefreshTokenCreateInput,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data });
  }
  @HandlePrismaNotFoundError()
  async findAndDeleteRefreshToken(
    refreshTokenUid: string,
  ): Promise<RefreshToken | null> {
    const resetToken = await this.prisma.refreshToken.delete({
      where: { uid: refreshTokenUid, expiryDate: { gte: new Date() } },
    });

    return resetToken;
  }

  @HandlePrismaNotFoundError()
  async findAndDeleteResetToken(
    resetTokenUid: string,
  ): Promise<ResetToken | null> {
    const resetToken = await this.prisma.resetToken.delete({
      where: { uid: resetTokenUid, expiryDate: { gte: new Date() } },
    });

    return resetToken;
  }
}

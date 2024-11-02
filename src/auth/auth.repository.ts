import { Injectable } from '@nestjs/common';

import { Prisma, RefreshToken, ResetToken } from '@prisma/client';
import { PrismaErrorCodes } from '@/constants';
import { PrismaService } from '@/prisma/prisma.service';

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

  async findAndDeleteRefreshToken(
    refreshTokenUid: string,
  ): Promise<RefreshToken | null> {
    try {
      const resetToken = await this.prisma.refreshToken.delete({
        where: { uid: refreshTokenUid, expiryDate: { gte: new Date() } },
      });

      return resetToken;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          return null;
        }
      }

      throw error;
    }
  }

  async findAndDeleteResetToken(
    resetTokenUid: string,
  ): Promise<ResetToken | null> {
    try {
      const resetToken = await this.prisma.resetToken.delete({
        where: { uid: resetTokenUid, expiryDate: { gte: new Date() } },
      });

      return resetToken;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          return null;
        }
      }

      throw error;
    }
  }
}

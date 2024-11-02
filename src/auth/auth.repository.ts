import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '@/constants';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findAndDeleteResetToken(token: string) {
    try {
      const resetToken = await this.prisma.resetToken.delete({
        where: { uid: token, expiryDate: { gte: new Date() } },
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

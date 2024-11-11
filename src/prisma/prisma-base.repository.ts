import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

export abstract class PrismaBaseRepository {
  constructor(prisma: PrismaService) {}

  async transaction(...args: Parameters<PrismaClient['$transaction']>) {
    // @ts-ignore
    return this.prisma.client.$transaction(...args);
  }
}

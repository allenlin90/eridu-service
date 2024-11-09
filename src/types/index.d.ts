import type { PrismaClient } from '@prisma/client';

export type DatabaseClient =
  | PrismaClient
  | Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

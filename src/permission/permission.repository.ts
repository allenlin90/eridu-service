import { PrismaBaseRepository } from '@/prisma/prisma-base.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepository extends PrismaBaseRepository {
  constructor(private prisma: PrismaService) {
    super(prisma);
  }

  get client() {
    return this.prisma.client;
  }
}

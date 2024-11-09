import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepository {
  constructor(private prisma: PrismaService) {}

  get client() {
    return this.prisma;
  }
}

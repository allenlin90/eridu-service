import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  get create() {
    return this.prisma.role.create;
  }
}

import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MembershipsRepository {
  constructor(private prisma: PrismaService) {}

  get create() {
    return this.prisma.membership.create;
  }
}

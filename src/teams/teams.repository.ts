import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TeamRepository {
  constructor(private prisma: PrismaService) {}

  get create() {
    return this.prisma.team.create;
  }
}

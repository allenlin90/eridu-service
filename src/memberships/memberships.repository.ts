import { Injectable } from '@nestjs/common';
import { Membership, PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

import { Entities, MEMBERSHIP_SEARCH_COLUMNS, Tables } from '@/constants';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { MembershipSearchQueryDto } from './dtos/membership-search.query.dto';

@Injectable()
export class MembershipsRepository {
  constructor(private prisma: PrismaService) {}

  get create() {
    return this.prisma.membership.create;
  }

  transaction(...args: Parameters<PrismaClient['$transaction']>) {
    return this.prisma.$transaction(...args);
  }

  @PaginationSearch<Membership, MembershipSearchQueryDto>(
    Entities.MEMBERSHIP,
    Tables.MEMBERSHIPS,
    MEMBERSHIP_SEARCH_COLUMNS,
  )
  async searchMemberships(_query: MembershipSearchQueryDto) {}
}

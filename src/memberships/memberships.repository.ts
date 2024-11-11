import { Injectable } from '@nestjs/common';
import { Membership, PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

import { Entities, MEMBERSHIP_SEARCH_COLUMNS, Tables } from '@/constants';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { MembershipSearchQueryDto } from './dtos/membership-search.query.dto';
import { PrismaBaseRepository } from '@/prisma/prisma-base.repository';

@Injectable()
export class MembershipsRepository extends PrismaBaseRepository {
  constructor(private prisma: PrismaService) {
    super(prisma);
  }

  get create() {
    return this.prisma.membership.create;
  }

  @PaginationSearch<Membership, MembershipSearchQueryDto>(
    Entities.MEMBERSHIP,
    Tables.MEMBERSHIPS,
    MEMBERSHIP_SEARCH_COLUMNS,
  )
  async searchMemberships(_query: MembershipSearchQueryDto) {}
}

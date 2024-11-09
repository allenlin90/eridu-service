import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

import { Entities, Tables, ROLE_SEARCH_COLUMNS } from '@/constants';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { RoleSearchQueryDto } from './dtos/role-search-query.dto';

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  get create() {
    return this.prisma.role.create;
  }

  @PaginationSearch<Role, RoleSearchQueryDto>(
    Entities.ROLE,
    Tables.ROLES,
    ROLE_SEARCH_COLUMNS,
  )
  async searchRoles(_query: RoleSearchQueryDto) {}
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PermissionsCache, User } from '@prisma/client';

import { Entities, Tables, USER_SEARCH_COLUMNS } from '@/constants';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { UserSearchQueryDto } from './dtos/user-search-query.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  get findUnique() {
    return this.prisma.user.findUnique;
  }

  get update() {
    return this.prisma.user.update;
  }

  get create() {
    return this.prisma.user.create;
  }

  @PaginationSearch<User, UserSearchQueryDto>(
    Entities.USER,
    Tables.USERS,
    USER_SEARCH_COLUMNS,
  )
  async searchUsers(_query: UserSearchQueryDto) {}
}

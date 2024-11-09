import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

import { Entities, Tables, USER_SEARCH_COLUMNS } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { PermissionService } from '@/permission/permission.service';

import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { UserSearchQueryDto } from './dtos/user-search-query.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private nanoIdService: NanoIdService,
    private permissionService: PermissionService,
  ) {}

  get findUnique() {
    return this.prisma.user.findUnique;
  }

  get update() {
    return this.prisma.user.update;
  }

  get create() {
    return this.prisma.user.create;
  }

  get upsertUserPermissionsCache() {
    return this.prisma.permissionsCache.upsert;
  }

  @PaginationSearch<User, UserSearchQueryDto>(
    Entities.USER,
    Tables.USERS,
    USER_SEARCH_COLUMNS,
  )
  async searchUsers(_query: UserSearchQueryDto) {}

  async createUserPermissionsCache({ userId }: { userId: number }) {
    const user = await this.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            team: { include: { business: true } },
            role: true,
          },
        },
      },
    });

    if (!user) return null;

    const payload = this.permissionService.getUserPermissionsPayload(user);
    const version = this.nanoIdService.generate();
    const permissions = this.permissionService.generateUserPermissions(payload);

    return this.upsertUserPermissionsCache({
      where: { userId: user.id },
      update: {
        permissions,
        version,
      },
      create: {
        user: { connect: { id: user.id } },
        version,
        permissions,
      },
    });
  }
}

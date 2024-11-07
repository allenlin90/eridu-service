import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Role, User } from '@prisma/client';

import { Entities, Tables, USER_SEARCH_COLUMNS } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';

import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { UserSearchQueryDto } from './dtos/user-search-query.dto';
import { UserPermissionsPayloadDto } from './dtos/user-permissions-payload.dto';

import { UserPermissions } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private nanoIdService: NanoIdService,
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
    const payload = await this.getUserPermissionsPayload({
      userId,
    });

    if (!payload) {
      return null;
    }

    const user = payload.user;
    const version = this.nanoIdService.generate();
    const permissions = this.generateUserPermissions(payload);

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

  async getUserPermissionsPayload({ userId }: { userId: number }) {
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

    if (!user) {
      return null;
    }

    const memberships = user.memberships ?? [];
    const roles = memberships.map((m) => m.role);
    const teams = memberships.map((m) => m.team);
    const businesses = teams.map((t) => t.business);

    return { user, memberships, roles, teams, businesses };
  }

  generateUserPermissions({
    user,
    roles,
    memberships,
    teams,
    businesses,
  }: UserPermissionsPayloadDto): UserPermissions {
    if (
      !user ||
      !roles.length ||
      !memberships.length ||
      !teams.length ||
      !businesses.length
    ) {
      // TODO: move argument validation to DTO
      throw new UnprocessableEntityException(
        'cannot generate user permissions',
      );
    }

    const rolesObj: Record<Role['id'], Role> = roles.reduce((store, role) => {
      store[role.id] = role;
      return store;
    }, {});

    const permissions = teams.reduce((store, team) => {
      const business = businesses.find((b) => b.id === team.businessId);
      const scope = memberships.reduce((store, membership) => {
        if (membership.teamId === team.id) {
          return store.concat(rolesObj[membership.roleId].name);
        }

        return store;
      }, []);

      store[team.uid] = {
        user_id: user.uid,
        business_id: business.uid,
        business_name: business.name,
        team_id: team.uid,
        team_name: team.name,
        scope,
      };

      return store;
    }, {});

    return permissions;
  }
}

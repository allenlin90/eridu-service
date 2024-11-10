import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Role } from '@prisma/client';

import type { DatabaseClient } from '@/types';
import { UserExpandedPayload, UserPermissions } from './interfaces';
import { PermissionRepository } from './permission.repository';
import { UserPermissionsPayloadDto } from './dtos/user-permissions-payload.dto';
import { NanoIdService } from '@/nano-id/nano-id.service';

@Injectable()
export class PermissionService {
  constructor(
    private nanoId: NanoIdService,
    private permissionRepository: PermissionRepository,
  ) {}

  // TODO: refactor to run in decorator as a side-effect after updating related resources
  // can run in a worker through task queue and store in cache storage
  /**
   * Updates or creates the user's permission cache based on their membership and role assignments.
   * This function should be called whenever a user's membership or role assignments change.
   *
   * @param userId The ID of the user whose permission cache should be updated.
   * @param client The database client to use for the transaction.
   * @returns The updated or created permission cache entry.
   */
  async upsertUserPermissionCache(userId: number, client?: DatabaseClient) {
    const dbClient = client || this.permissionRepository.client;

    const user = await dbClient.user.findUnique({
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

    const payload = this.getUserPermissionsPayload(user);
    const version = this.nanoId.generate();
    const permissions = this.generateUserPermissions(payload);

    return dbClient.permissionsCache.upsert({
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

  private getUserPermissionsPayload(user: UserExpandedPayload) {
    const memberships = user.memberships ?? [];
    const roles = memberships.map((m) => m.role);
    const teams = memberships.map((m) => m.team);
    const businesses = teams.map((t) => t.business);

    return { user, memberships, roles, teams, businesses };
  }

  private generateUserPermissions(
    args: UserPermissionsPayloadDto,
  ): UserPermissions {
    // TODO: move argument validation to DTO
    this.validateUserPermissionsPayload(args);

    const { user, roles, memberships, teams, businesses } = args;

    const rolesObj: Record<Role['id'], Role> = roles.reduce((store, role) => {
      store[role.id] = role;
      return store;
    }, {});

    const permissions = teams.reduce((store, team) => {
      const business = businesses.find((b) => b.id === team.businessId);

      const scope = memberships.reduce((store, membership) => {
        if (membership.teamId !== team.id) return store;

        const role = rolesObj[membership.roleId];
        if (!role) return store;

        return store.concat({ id: role.uid, name: role.name });
      }, []);

      store[team.uid] = {
        user_id: user.uid,
        business_id: business.uid,
        business_name: business.name,
        team_id: team.uid,
        team_name: team.name,
        is_sub_team: !!team.parentTeamId,
        scope,
      };

      return store;
    }, {});

    return permissions;
  }

  private validateUserPermissionsPayload({
    user,
    roles,
    memberships,
    teams,
    businesses,
  }: UserPermissionsPayloadDto) {
    if (
      !user ||
      !roles.length ||
      !memberships.length ||
      !teams.length ||
      !businesses.length
    ) {
      throw new UnprocessableEntityException(
        'cannot generate user permissions',
      );
    }
  }
}

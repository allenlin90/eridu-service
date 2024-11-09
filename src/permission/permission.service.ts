import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Role } from '@prisma/client';

import { UserExpandedPayload, UserPermissions } from './interfaces';
import { UserPermissionsPayloadDto } from './dtos/user-permissions-payload.dto';

@Injectable()
export class PermissionService {
  getUserPermissionsPayload(user: UserExpandedPayload) {
    const memberships = user.memberships ?? [];
    const roles = memberships.map((m) => m.role);
    const teams = memberships.map((m) => m.team);
    const businesses = teams.map((t) => t.business);

    return { user, memberships, roles, teams, businesses };
  }

  generateUserPermissions(args: UserPermissionsPayloadDto): UserPermissions {
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

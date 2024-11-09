import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { PermissionService } from '@/permission/permission.service';
import { MembershipsRepository } from './memberships.repository';
import { CreateMembershipDto } from './dtos/create-membership.dto';
import { MembershipSearchQueryDto } from './dtos/membership-search.query.dto';

@Injectable()
export class MembershipsService {
  constructor(
    private nanoId: NanoIdService,
    private permissionService: PermissionService,
    private membershipsRepository: MembershipsRepository,
  ) {}

  async searchMemberships(query: MembershipSearchQueryDto) {
    return this.membershipsRepository.searchMemberships(query);
  }

  async create(data: CreateMembershipDto) {
    const { uid, team_id, role_id, user_id, type } =
      this.createMembershipPayload(data);

    return this.membershipsRepository.create({
      data: {
        uid,
        type: type || 'member',
        user: { connect: { uid: user_id } },
        role: { connect: { uid: role_id } },
        team: { connect: { uid: team_id } },
      },
    });
  }

  async createMembershipWithPermissionCacheUpdate(data: CreateMembershipDto) {
    return this.membershipsRepository.transaction(async (tx) => {
      const { uid, team_id, role_id, user_id, type } =
        this.createMembershipPayload(data);

      const membership = await tx.membership.create({
        data: {
          uid,
          type: type || 'member',
          user: { connect: { uid: user_id } },
          role: { connect: { uid: role_id } },
          team: { connect: { uid: team_id } },
        },
      });

      const user = await tx.user.findUnique({
        where: { id: membership.userId },
        include: {
          memberships: {
            include: {
              team: { include: { business: true } },
              role: true,
            },
          },
        },
      });

      const payload = this.permissionService.getUserPermissionsPayload(user);
      const version = this.nanoId.generate();
      const permissions =
        this.permissionService.generateUserPermissions(payload);

      await tx.permissionsCache.upsert({
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

      return membership;
    });
  }

  private createMembershipPayload(data: CreateMembershipDto) {
    const { team_id, role_id, user_id, type } = data;
    let uid = data.uid;

    if (!uid) {
      uid = this.generateMembershipUid();
    }

    return { uid, team_id, role_id, user_id, type };
  }

  private generateMembershipUid() {
    return `${Prefixes.MEMBERSHIP}_${this.nanoId.generate()}`;
  }
}

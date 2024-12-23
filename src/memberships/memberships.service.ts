import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { PermissionService } from '@/permission/permission.service';
import { MembershipsRepository } from './memberships.repository';
import { CreateMembershipDto } from './dtos/create-membership.dto';
import { MembershipSearchQueryDto } from './dtos/membership-search.query.dto';
import { UpdateMembershipDto } from './dtos/update-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(
    private nanoId: NanoIdService,
    private permissionService: PermissionService,
    private membershipsRepository: MembershipsRepository,
  ) {}

  get findUnique() {
    return this.membershipsRepository.findUnique;
  }

  async searchMemberships(query: MembershipSearchQueryDto) {
    return this.membershipsRepository.searchMemberships(query);
  }

  async create(data: CreateMembershipDto) {
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
        include: { team: true, role: true },
      });

      if (membership.team.businessId !== membership.role.businessId) {
        throw new ConflictException(
          'team and role must be in the same business',
        );
      }

      return membership;
    });
  }

  async delete(where: Prisma.MembershipWhereUniqueInput) {
    return this.membershipsRepository.transaction(async (tx) => {
      const membership = await tx.membership.delete({ where });

      if (!membership) {
        throw new NotFoundException(`Membership ID: ${where.uid} not found`);
      }

      await tx.permissionsCache.delete({
        where: { userId: membership.userId },
      });

      return membership;
    });
  }

  async updateMembershipWithPermissionCacheUpdate(
    membershipId: string,
    data: UpdateMembershipDto,
  ) {
    return this.membershipsRepository.transaction(async (tx) => {
      const membership = await tx.membership.update({
        where: { uid: membershipId },
        data: {
          ...(data.type && { type: data.type }),
          ...(data.role_id && { role: { connect: { uid: data.role_id } } }),
        },
        include: { team: true, role: true },
      });

      if (membership.team.businessId !== membership.role.businessId) {
        throw new ConflictException(
          'team and role must be in the same business',
        );
      }

      await this.permissionService.upsertUserPermissionCache(
        membership.userId,
        tx,
      );

      return membership;
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
        include: { team: true, role: true },
      });

      if (membership.team.businessId !== membership.role.businessId) {
        throw new ConflictException(
          'team and role must be in the same business',
        );
      }

      await this.permissionService.upsertUserPermissionCache(
        membership.userId,
        tx,
      );

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

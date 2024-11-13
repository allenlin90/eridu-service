import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RoleSearchQueryDto } from './dtos/role-search-query.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private nanoId: NanoIdService,
    private rolesRepository: RolesRepository,
  ) {}

  get findUnique() {
    return this.rolesRepository.findUnique;
  }

  async create(data: CreateRoleDto) {
    let uid = data.uid;

    if (!uid) {
      uid = `${Prefixes.ROLE}_${this.nanoId.generate()}`;
    }

    return this.rolesRepository.create({
      data: {
        uid,
        name: data.name,
        business: { connect: { uid: data.business_id } },
      },
    });
  }

  async searchRoles(query: RoleSearchQueryDto) {
    return this.rolesRepository.searchRoles(query);
  }

  async update(roleId: string, data: UpdateRoleDto) {
    return this.rolesRepository.transaction(async (tx) => {
      const updatedRole = await tx.role.update({
        where: { uid: roleId },
        data,
        include: { memberships: true },
      });

      // TODO: refactor to be done as side-effect e.g. decorator
      // TODO: optimize this to prevent performance bottleneck
      const userIds = updatedRole.memberships.map((m) => m.userId);
      await tx.permissionsCache.deleteMany({
        where: { userId: { in: userIds } },
      });

      return updatedRole;
    });
  }

  async delete(where: Prisma.RoleWhereUniqueInput) {
    return this.rolesRepository.transaction(async (tx) => {
      const role = await tx.role.findUnique({
        where,
        include: { memberships: true },
      });

      if (!role) {
        throw new NotFoundException(`Role ID: ${where.uid} not found`);
      }

      await tx.role.delete({ where: { id: role.id } });

      const membershipIds = role.memberships.map((m) => m.id);
      await tx.membership.deleteMany({ where: { id: { in: membershipIds } } });

      // TODO: refactor to be done as side-effect e.g. decorator
      // TODO: optimize this to prevent performance bottleneck
      const userIds = role.memberships.map((m) => m.userId);
      await tx.permissionsCache.deleteMany({
        where: { userId: { in: userIds } },
      });

      return role;
    });
  }
}

import { Injectable } from '@nestjs/common';

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

      const userIds = updatedRole.memberships.map((m) => m.userId);
      // TODO: refactor to be done as side-effect e.g. decorator
      await tx.permissionsCache.deleteMany({
        where: { userId: { in: userIds } },
      });

      return updatedRole;
    });
  }
}

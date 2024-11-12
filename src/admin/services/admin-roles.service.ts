import { Injectable, NotFoundException } from '@nestjs/common';

import { RolesService } from '@/roles/roles.service';
import { CreateRoleDto } from '@/roles/dtos/create-role.dto';
import { RoleSearchQueryDto } from '@/roles/dtos/role-search-query.dto';

@Injectable()
export class AdminRolesService {
  constructor(private rolesService: RolesService) {}

  async create(data: CreateRoleDto) {
    return this.rolesService.create(data);
  }

  async getRoles(query: RoleSearchQueryDto) {
    return this.rolesService.searchRoles(query);
  }

  async findUnique(roleUid: string) {
    const role = await this.rolesService.findUnique({
      where: { uid: roleUid },
    });

    if (!role) {
      throw new NotFoundException(`cannot find role by id: ${roleUid}`);
    }

    return role;
  }
}

import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RoleSearchQueryDto } from './dtos/role-search-query.dto';

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
}

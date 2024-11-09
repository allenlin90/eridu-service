import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dtos/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private nanoId: NanoIdService,
    private rolesRepository: RolesRepository,
  ) {}

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
}

import { Injectable } from '@nestjs/common';
import { RolesService } from '@/roles/roles.service';
import { CreateRoleDto } from '@/roles/dtos/create-role.dto';

@Injectable()
export class AdminRolesService {
  constructor(private rolesService: RolesService) {}

  async create(data: CreateRoleDto) {
    return this.rolesService.create(data);
  }
}

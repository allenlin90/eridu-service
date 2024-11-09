import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { AdminRolesService } from '../services/admin-roles.service';
import { CreateRoleDto } from '@/roles/dtos/create-role.dto';
import { RoleResponseDto } from '@/roles/dtos/role-response.dto';
import { RoleListResponseDto } from '@/roles/dtos/role-list-response.dto';
import { RoleSearchQueryDto } from '@/roles/dtos/role-search-query.dto';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/roles')
export class AdminRolesController {
  constructor(private adminRolesService: AdminRolesService) {}

  @Serialize(RoleResponseDto)
  @Post('/')
  async createRole(@Body() data: CreateRoleDto) {
    return this.adminRolesService.create(data);
  }

  @Serialize(RoleListResponseDto)
  @Get('/')
  async getMemberships(@Query() query: RoleSearchQueryDto) {
    return this.adminRolesService.getRoles(query);
  }
}

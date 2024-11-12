import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { AdminRolesService } from '../services/admin-roles.service';
import { CreateRoleDto } from '@/roles/dtos/create-role.dto';
import { RoleResponseDto } from '@/roles/dtos/role-response.dto';
import { RoleListResponseDto } from '@/roles/dtos/role-list-response.dto';
import { RoleSearchQueryDto } from '@/roles/dtos/role-search-query.dto';
import { UpdateRoleDto } from '@/roles/dtos/update-role.dto';

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
  async getRoles(@Query() query: RoleSearchQueryDto) {
    return this.adminRolesService.getRoles(query);
  }

  @Serialize(RoleResponseDto)
  @Get('/:role_id')
  async getRoleById(@Param('role_id') roleId: string) {
    return this.adminRolesService.findUnique(roleId);
  }

  @Serialize(RoleResponseDto)
  @Put('/:role_id')
  async updateOneRole(
    @Param('role_id') roleId: string,
    @Body() data: UpdateRoleDto,
  ) {
    return this.adminRolesService.update(roleId, data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:role_id')
  async deleteOneROle(@Param('role_id') roleId: string) {
    return this.adminRolesService.delete(roleId);
  }
}

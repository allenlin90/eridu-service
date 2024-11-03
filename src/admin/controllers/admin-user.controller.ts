import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { UserListDto } from '@/users/dtos/user-list.dto';
import { UserResponseDto } from '@/users/dtos/user-response.dto';
import { UserSearchQueryDto } from '@/users/dtos/user-search-query.dto';
import { ResetTokenResponseDto } from '../dtos/reset-token-response.dto';
import { AdminService } from '../admin.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private adminService: AdminService) {}

  @Serialize(UserListDto)
  @Get('/')
  async getUsers(@Query() query: UserSearchQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Serialize(UserResponseDto)
  @Get(':user_id')
  async getUser(@Param('user_id') userId: string) {
    return this.adminService.getUser(userId);
  }

  @Serialize(ResetTokenResponseDto)
  @Post(':user_id/reset-token')
  async createUserResetToken(@Param('user_id') userId: string) {
    return this.adminService.generateResetToken(userId);
  }
}

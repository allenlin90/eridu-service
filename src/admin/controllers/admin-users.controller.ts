import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { UserListDto } from '@/users/dtos/user-list.dto';
import { UserResponseDto } from '@/users/dtos/user-response.dto';
import { UserSearchQueryDto } from '@/users/dtos/user-search-query.dto';
import { ResetTokenResponseDto } from '../dtos/reset-token-response.dto';
import { AdminUsersService } from '../services/admin-users.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

  @Serialize(UserListDto)
  @Get('/')
  async getUsers(@Query() query: UserSearchQueryDto) {
    return this.adminUsersService.getUsers(query);
  }

  @Serialize(UserResponseDto)
  @Get(':user_id')
  async getUser(@Param('user_id') userId: string) {
    return this.adminUsersService.getUser(userId);
  }

  @Serialize(ResetTokenResponseDto)
  @Post(':user_id/reset-token')
  async createUserResetToken(@Param('user_id') userId: string) {
    return this.adminUsersService.generateResetToken(userId);
  }
}

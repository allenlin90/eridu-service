import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { PaginationQueryDto } from '@/dto/pagination.dto';
import { UsersService } from '@/users/users.service';
import { UserListDto } from '@/users/dtos/user-list.dto';
import { ResetTokenResponseDto } from '../dtos/reset-token-response.dto';
import { AdminService } from '../admin.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(
    private adminService: AdminService,
    private usersService: UsersService,
  ) {}

  @Serialize(UserListDto)
  @Get('/')
  async getUsers(@Query() query: PaginationQueryDto) {
    return this.usersService.searchUsers(query);
  }

  @Serialize(ResetTokenResponseDto)
  @Post(':user_id/reset-token')
  async createUserResetToken(@Param('user_id') userId: string) {
    return this.adminService.generateResetToken(userId);
  }
}

import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { UsersService } from '@/users/users.service';
import { UserResponseDto } from '@/users/dtos/user-response.dto';
import { ResetTokenResponseDto } from '../dtos/reset-token-response.dto';
import { AdminService } from '../admin.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(
    private adminService: AdminService,
    private usersService: UsersService,
  ) {}

  @Serialize(UserResponseDto)
  @Get('/')
  async getUsers() {
    return this.usersService.findAll();
  }

  @Serialize(ResetTokenResponseDto)
  @Post(':user_id/reset-token')
  async createUserResetToken(@Param('user_id') userId: string) {
    return this.adminService.generateResetToken(userId);
  }
}

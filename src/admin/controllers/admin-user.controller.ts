import { Controller, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ResetTokenResponseDto } from '../dtos/reset-token-response.dto';
import { AdminService } from '../admin.service';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private adminService: AdminService) {}

  @Serialize(ResetTokenResponseDto)
  @UseGuards(AuthGuard, AdminGuard)
  @Post(':user_id/reset-token')
  async createUserResetToken(@Param('user_id') userId: string) {
    return this.adminService.generateResetToken(userId);
  }
}

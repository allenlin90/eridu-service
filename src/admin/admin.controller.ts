import { Controller, Param, Post, UseGuards } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ResetTokenResponseDto } from './dtos/reset-token-response.dto';

@Controller('admin')
export class AdminController {
  constructor(private authService: AuthService) {}

  @Serialize(ResetTokenResponseDto)
  @UseGuards(AuthGuard, AdminGuard)
  @Post('users/:user_id/reset-token')
  async createUserResetToken(@Param('user_id') userId: string) {
    return this.authService.generateResetToken(userId);
  }
}

import type { Request } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthTokensInterceptor } from '@/interceptors/auth-tokens.interceptor';
import { LogoutInterceptor } from '@/interceptors/logout.interceptor';

import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { AuthGuard } from '@/guards/auth.guard';
import { UserDto } from '@/users/dtos/user.dto';
import { RefreshTokenGuard } from '@/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(AuthTokensInterceptor)
  @Post('signup')
  signup(@Body() signupData: SignupDto) {
    return this.authService.signupLocal(signupData);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthTokensInterceptor)
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(AuthTokensInterceptor)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req.refreshToken);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(LogoutInterceptor)
  @Post('logout')
  async logout(@Req() req: Request) {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    await this.authService.logout({
      accessToken,
      refreshToken: req.refreshToken,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(@Body() data: ChangePasswordDto, @Req() req: Request) {
    return this.authService.changePassword(req.userId, data);
  }

  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}

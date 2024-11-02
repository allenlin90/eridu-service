import type { Request } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UnauthorizedException,
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(AuthTokensInterceptor)
  @Post('signup')
  signup(@Body() signupData: SignupDto) {
    return this.authService.signupLocal(signupData);
  }

  @UseInterceptors(AuthTokensInterceptor)
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @UseInterceptors(AuthTokensInterceptor)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      new UnauthorizedException('invalid refresh token');
    }

    return this.authService.refreshToken(refreshToken);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(LogoutInterceptor)
  @Post('logout')
  async logout(@Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('invalid refresh token');
    }

    const accessToken = req.headers['authorization']?.split(' ')[1];

    await this.authService.logout({ accessToken, refreshToken });
  }

  @HttpCode(200)
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(@Body() data: ChangePasswordDto, @Req() req: Request) {
    return this.authService.changePassword(req.userId, data);
  }

  @HttpCode(200)
  @Serialize(UserDto)
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}

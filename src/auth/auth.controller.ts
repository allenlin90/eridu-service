import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { AuthTokensInterceptor } from '@/interceptors/auth-tokens.interceptor';

import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(AuthTokensInterceptor)
  @Post('/signup')
  signup(@Body() signupData: SignupDto) {
    return this.authService.signupLocal(signupData);
  }

  @UseInterceptors(AuthTokensInterceptor)
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}

import { Injectable } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(private authService: AuthService) {}

  async generateResetToken(userId: string) {
    return this.authService.generateResetToken(userId);
  }
}

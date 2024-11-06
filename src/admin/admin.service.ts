import { Injectable } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { UserSearchQueryDto } from '@/users/dtos/user-search-query.dto';

@Injectable()
export class AdminService {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async getUsers(query: UserSearchQueryDto) {
    return this.usersService.searchUsers(query);
  }

  async getUser(userId: string) {
    return this.usersService.findUnique({ where: { uid: userId } });
  }

  async generateResetToken(userId: string) {
    return this.authService.generateResetToken(userId);
  }
}

import { Module } from '@nestjs/common';
import { AdminUsersService } from './services/admin-users.service';
import { AdminUsersController } from './controllers/admin-user.controller';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [AdminUsersService],
  controllers: [AdminUsersController],
})
export class AdminModule {}

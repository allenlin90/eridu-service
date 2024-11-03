import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminUsersController } from './controllers/admin-user.controller';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [AdminService],
  controllers: [AdminUsersController],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { NanoIdModule } from '@/nano-id/nano-id.module';
import { BusinessesModule } from '@/businesses/businesses.module';

import { AdminUsersController } from './controllers/admin-user.controller';
import { AdminBusinessesController } from './controllers/admin-businesses.controller';

import { AdminUsersService } from './services/admin-users.service';
import { AdminBusinessesService } from './services/admin-businesses.service';

@Module({
  imports: [AuthModule, UsersModule, BusinessesModule, NanoIdModule],
  providers: [AdminUsersService, AdminBusinessesService],
  controllers: [AdminUsersController, AdminBusinessesController],
})
export class AdminModule {}

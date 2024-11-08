import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { NanoIdModule } from '@/nano-id/nano-id.module';
import { BusinessesModule } from '@/businesses/businesses.module';
import { TeamsModule } from '@/teams/teams.module';

import { AdminUsersController } from './controllers/admin-user.controller';
import { AdminBusinessesController } from './controllers/admin-businesses.controller';
import { AdminTeamsController } from './controllers/admin-teams.controller';

import { AdminUsersService } from './services/admin-users.service';
import { AdminBusinessesService } from './services/admin-businesses.service';
import { AdminTeamsService } from './services/admin-teams.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BusinessesModule,
    NanoIdModule,
    TeamsModule,
  ],
  providers: [AdminUsersService, AdminBusinessesService, AdminTeamsService],
  controllers: [
    AdminUsersController,
    AdminBusinessesController,
    AdminTeamsController,
  ],
})
export class AdminModule {}

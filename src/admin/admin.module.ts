import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { NanoIdModule } from '@/nano-id/nano-id.module';
import { BusinessesModule } from '@/businesses/businesses.module';
import { TeamsModule } from '@/teams/teams.module';
import { MembershipsModule } from '@/memberships/memberships.module';
import { RolesModule } from '@/roles/roles.module';

import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminBusinessesController } from './controllers/admin-businesses.controller';
import { AdminTeamsController } from './controllers/admin-teams.controller';
import { AdminMembershipsController } from './controllers/admin-memberships.controller';
import { AdminRolesController } from './controllers/admin-roles.controller';

import { AdminUsersService } from './services/admin-users.service';
import { AdminBusinessesService } from './services/admin-businesses.service';
import { AdminTeamsService } from './services/admin-teams.service';
import { AdminMembershipsService } from './services/admin-memberships.service';
import { AdminRolesService } from './services/admin-roles.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BusinessesModule,
    NanoIdModule,
    TeamsModule,
    MembershipsModule,
    RolesModule,
  ],
  providers: [
    AdminUsersService,
    AdminBusinessesService,
    AdminTeamsService,
    AdminMembershipsService,
    AdminRolesService,
  ],
  controllers: [
    AdminUsersController,
    AdminBusinessesController,
    AdminTeamsController,
    AdminMembershipsController,
    AdminRolesController,
  ],
})
export class AdminModule {}

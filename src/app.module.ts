import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import config, { ConfigKeys } from './config';

import { AppController } from '@/app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { NanoIdModule } from './nano-id/nano-id.module';
import { BusinessesModule } from './businesses/businesses.module';
import { TeamsModule } from './teams/teams.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [config] }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>(ConfigKeys.JWT_SECRET),
        signOptions: {
          expiresIn: config.get<string>(ConfigKeys.JWT_EXPIRES_IN),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminModule,
    NanoIdModule,
    BusinessesModule,
    TeamsModule,
    MembershipsModule,
    RolesModule,
    PermissionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

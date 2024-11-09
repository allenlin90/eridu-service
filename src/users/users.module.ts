import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

import { NanoIdModule } from '@/nano-id/nano-id.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  imports: [NanoIdModule, PermissionModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

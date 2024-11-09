import { Module } from '@nestjs/common';
import { NanoIdModule } from '@/nano-id/nano-id.module';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from './memberships.repository';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  imports: [NanoIdModule, PermissionModule],
  providers: [MembershipsService, MembershipsRepository],
  exports: [MembershipsService],
})
export class MembershipsModule {}

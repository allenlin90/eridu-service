import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import { NanoIdModule } from '@/nano-id/nano-id.module';

@Module({
  imports: [NanoIdModule],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionModule {}

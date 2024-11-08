import { Module } from '@nestjs/common';
import { NanoIdModule } from '@/nano-id/nano-id.module';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from './memberships.repository';

@Module({
  imports: [NanoIdModule],
  providers: [MembershipsService, MembershipsRepository],
  exports: [MembershipsService],
})
export class MembershipsModule {}

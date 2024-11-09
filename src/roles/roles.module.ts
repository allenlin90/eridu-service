import { Module } from '@nestjs/common';
import { NanoIdModule } from '@/nano-id/nano-id.module';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [NanoIdModule],
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}

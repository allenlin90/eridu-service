import { Module } from '@nestjs/common';

import { NanoIdModule } from '@/nano-id/nano-id.module';

import { BusinessesService } from './businesses.service';
import { BusinessesRepository } from './businesses.repository';

@Module({
  imports: [NanoIdModule],
  providers: [BusinessesService, BusinessesRepository],
  exports: [BusinessesService],
})
export class BusinessesModule {}

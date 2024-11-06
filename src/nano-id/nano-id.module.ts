import { nanoid } from 'nanoid';
import { Module } from '@nestjs/common';

import { NanoIdService } from './nano-id.service';
import { ProviderKeys } from '@/constants';

@Module({
  providers: [
    { provide: ProviderKeys.NANO_ID, useValue: nanoid },
    NanoIdService,
  ],
  exports: [NanoIdService],
})
export class NanoIdModule {}

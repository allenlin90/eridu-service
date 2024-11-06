import type { nanoid as nanoId } from 'nanoid';
import { Inject, Injectable } from '@nestjs/common';

import { ProviderKeys } from '@/constants';

@Injectable()
export class NanoIdService {
  constructor(@Inject(ProviderKeys.NANO_ID) private nanoid: typeof nanoId) {}

  get generate() {
    return this.nanoid;
  }
}

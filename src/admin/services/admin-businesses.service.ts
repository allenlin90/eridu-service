import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { BusinessesService } from '@/businesses/businesses.service';

import { CreateBusinessDto } from '../dtos/create-business.dto';

@Injectable()
export class AdminBusinessesService {
  constructor(
    private businessesService: BusinessesService,
    private nanoId: NanoIdService,
  ) {}

  async createBusiness(args: CreateBusinessDto) {
    const uid = `${Prefixes.BUSINESS}_${this.nanoId.generate()}`;

    return this.businessesService.createBusiness({
      name: args.name,
      uid,
    });
  }
}

import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { CreateBusinessDto } from '@/businesses/dtos/create-business.dto';
import { BusinessSearchQueryDto } from '@/businesses/dtos/business-search-query.dto';

import { NanoIdService } from '@/nano-id/nano-id.service';
import { BusinessesService } from '@/businesses/businesses.service';

@Injectable()
export class AdminBusinessesService {
  constructor(
    private businessesService: BusinessesService,
    private nanoId: NanoIdService,
  ) {}

  async getBusinesses(query: BusinessSearchQueryDto) {
    return this.businessesService.getBusinesses(query);
  }

  async createBusiness(args: CreateBusinessDto) {
    const uid = `${Prefixes.BUSINESS}_${this.nanoId.generate()}`;

    return this.businessesService.createBusiness({
      name: args.name,
      uid,
    });
  }
}

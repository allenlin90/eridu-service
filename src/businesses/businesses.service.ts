import { NanoIdService } from '@/nano-id/nano-id.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { Prefixes } from '@/constants';
import { BusinessesRepository } from './businesses.repository';
import { BusinessSearchQueryDto } from './dtos/business-search-query.dto';

@Injectable()
export class BusinessesService {
  constructor(
    private nanoIdService: NanoIdService,
    private businessesRepository: BusinessesRepository,
  ) {}

  async getBusinesses(query: BusinessSearchQueryDto) {
    return this.businessesRepository.searchBusinesses(query);
  }

  async createBusiness(data: Prisma.BusinessCreateInput) {
    let uid = data.uid;

    if (!uid) {
      uid = `${Prefixes.BUSINESS}_${this.nanoIdService.generate()}`;
    }

    return this.businessesRepository.create({ data: { ...data, uid } });
  }
}

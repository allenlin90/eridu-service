import { NanoIdService } from '@/nano-id/nano-id.service';
import { Injectable } from '@nestjs/common';

import { BusinessesRepository } from './businesses.repository';
import { Prisma } from '@prisma/client';
import { Prefixes } from '@/constants';

@Injectable()
export class BusinessesService {
  constructor(
    private nanoIdService: NanoIdService,
    private businessesRepository: BusinessesRepository,
  ) {}

  async createBusiness(data: Prisma.BusinessCreateInput) {
    let uid = data.uid;

    if (!uid) {
      uid = `${Prefixes.BUSINESS}_${this.nanoIdService.generate()}`;
    }

    return this.businessesRepository.create({ data: { ...data, uid } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { CreateBusinessDto } from '@/businesses/dtos/create-business.dto';
import { BusinessSearchQueryDto } from '@/businesses/dtos/business-search-query.dto';

import { NanoIdService } from '@/nano-id/nano-id.service';
import { BusinessesService } from '@/businesses/businesses.service';

@Injectable()
export class AdminBusinessesService {
  constructor(
    private nanoId: NanoIdService,
    private businessesService: BusinessesService,
  ) {}

  async findUnique(businessId: string) {
    const business = await this.businessesService.findUnique({
      where: { uid: businessId },
      include: {
        roles: true,
        features: true,
        teams: {
          include: {
            memberships: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException(`cannot find business by id: ${businessId}`);
    }

    return business;
  }

  async delete(businessId: string) {
    return this.businessesService.delete({
      where: { uid: businessId },
    });
  }

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

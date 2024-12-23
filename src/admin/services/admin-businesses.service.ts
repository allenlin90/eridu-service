import { Injectable, NotFoundException } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { CreateBusinessDto } from '@/businesses/dtos/create-business.dto';
import { BusinessSearchQueryDto } from '@/businesses/dtos/business-search-query.dto';

import { NanoIdService } from '@/nano-id/nano-id.service';
import { BusinessesService } from '@/businesses/businesses.service';
import { UpdateBusinessDto } from '@/businesses/dtos/update-business.dto';

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
    return this.businessesService.delete({ uid: businessId });
  }

  async getBusinesses(query: BusinessSearchQueryDto) {
    return this.businessesService.getBusinesses(query);
  }

  async create(args: CreateBusinessDto) {
    const uid = `${Prefixes.BUSINESS}_${this.nanoId.generate()}`;

    return this.businessesService.create({
      name: args.name,
      uid,
    });
  }

  async update(businessId: string, data: UpdateBusinessDto) {
    return this.businessesService.update({
      where: { uid: businessId },
      data,
    });
  }
}

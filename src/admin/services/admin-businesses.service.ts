import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { BusinessesService } from '@/businesses/businesses.service';
import { TeamsService } from '@/teams/teams.service';

import { CreateBusinessDto } from '../dtos/create-business.dto';
import { BusinessSearchQueryDto } from '@/businesses/dtos/business-search-query.dto';
import { CreateTeamDto } from '@/teams/dtos/create-team.dto';

@Injectable()
export class AdminBusinessesService {
  constructor(
    private businessesService: BusinessesService,
    private nanoId: NanoIdService,
    private teamsService: TeamsService,
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

  async createTeam(businessId: string, args: CreateTeamDto) {
    const uid = `${Prefixes.TEAM}_${this.nanoId.generate()}`;

    return this.teamsService.create({
      data: {
        name: args.name,
        uid,
        business: { connect: { uid: businessId } },
      },
    });
  }
}

import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { TeamSearchQueryDto } from '@/teams/dtos/team-search-query.dto';
import { CreateTeamDto } from '@/teams/dtos/create-team.dto';
import { TeamsService } from '@/teams/teams.service';
import { NanoIdService } from '@/nano-id/nano-id.service';

@Injectable()
export class AdminTeamsService {
  constructor(
    private nanoId: NanoIdService,
    private teamsService: TeamsService,
  ) {}

  async getTeams(query: TeamSearchQueryDto) {
    return this.teamsService.searchTeams(query);
  }

  async create(data: CreateTeamDto) {
    const { name, business_id } = data;

    let uid = data.uid;

    if (!uid) {
      uid = `${Prefixes.TEAM}_${this.nanoId.generate()}`;
    }

    return this.teamsService.create({
      data: {
        name,
        uid,
        business: { connect: { uid: business_id } },
      },
    });
  }

  async findUnique(teamId: string) {
    return this.teamsService.findUnique({ where: { uid: teamId } });
  }
}

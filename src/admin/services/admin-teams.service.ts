import { Injectable } from '@nestjs/common';

import { TeamsService } from '@/teams/teams.service';
import { TeamSearchQueryDto } from '@/teams/dtos/team-search-query.dto';

@Injectable()
export class AdminTeamsService {
  constructor(private teamsService: TeamsService) {}

  async getTeams(query: TeamSearchQueryDto) {
    return this.teamsService.searchTeams(query);
  }
}

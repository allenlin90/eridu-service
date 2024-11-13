import { Injectable } from '@nestjs/common';

import { TeamRepository } from './teams.repository';
import { TeamSearchQueryDto } from './dtos/team-search-query.dto';

@Injectable()
export class TeamsService {
  constructor(private teamRepository: TeamRepository) {}

  get create() {
    return this.teamRepository.create;
  }

  get findUnique() {
    return this.teamRepository.findUnique;
  }

  async searchTeams(query: TeamSearchQueryDto) {
    return this.teamRepository.searchTeams(query);
  }
}

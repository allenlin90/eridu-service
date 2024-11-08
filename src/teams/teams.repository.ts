import { Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

import { Entities, Tables, TEAM_SEARCH_COLUMNS } from '@/constants';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { TeamSearchQueryDto } from './dtos/team-search-query.dto';

@Injectable()
export class TeamRepository {
  constructor(private prisma: PrismaService) {}

  get create() {
    return this.prisma.team.create;
  }

  @PaginationSearch<Team, TeamSearchQueryDto>(
    Entities.TEAM,
    Tables.TEAMS,
    TEAM_SEARCH_COLUMNS,
  )
  async searchTeams(_query: TeamSearchQueryDto) {}
}

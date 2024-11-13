import { Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

import { Entities, Tables, TEAM_SEARCH_COLUMNS } from '@/constants';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { PrismaBaseRepository } from '@/prisma/prisma-base.repository';
import { TeamSearchQueryDto } from './dtos/team-search-query.dto';

@Injectable()
export class TeamRepository extends PrismaBaseRepository {
  constructor(private prisma: PrismaService) {
    super(prisma);
  }

  get create() {
    return this.prisma.client.team.create;
  }

  get findUnique() {
    return this.prisma.client.team.findUnique;
  }

  @PaginationSearch<Team, TeamSearchQueryDto>(
    Entities.TEAM,
    Tables.TEAMS,
    TEAM_SEARCH_COLUMNS,
  )
  async searchTeams(_query: TeamSearchQueryDto) {}
}

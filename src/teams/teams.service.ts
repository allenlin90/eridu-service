import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
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

  async delete(where: Prisma.TeamWhereUniqueInput) {
    return this.teamRepository.transaction(async (tx) => {
      const team = await tx.team.findUnique({
        where,
        include: {
          // TODO: optimize sub-team recursive deletion
          subTeams: {
            include: {
              memberships: true,
            },
          },
          memberships: true,
        },
      });

      if (!team) {
        throw new NotFoundException(`team ID: ${where.uid} not found`);
      }

      await tx.team.deleteMany({
        where: { OR: [{ id: team.id }, { parentTeamId: team.id }] },
      });

      await tx.membership.deleteMany({ where: { teamId: team.id } });

      // TODO: refactor to be done as side-effect e.g. decorator
      // TODO: optimize this to prevent performance bottleneck
      const subTeamUserIds = team.subTeams.reduce(
        (list, t) => list.concat(t.memberships.map((m) => m.userId)),
        [],
      );
      const userIds = team.memberships.map((m) => m.userId);
      await tx.permissionsCache.deleteMany({
        where: { userId: { in: subTeamUserIds.concat(userIds) } },
      });

      return team;
    });
  }
}

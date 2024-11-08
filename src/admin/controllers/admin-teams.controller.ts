import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { TeamSearchQueryDto } from '@/teams/dtos/team-search-query.dto';
import { TeamListResponseDto } from '@/teams/dtos/team-list-response.dto';
import { AdminTeamsService } from '../services/admin-teams.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/teams')
export class AdminTeamsController {
  constructor(private adminTeamsService: AdminTeamsService) {}

  @Serialize(TeamListResponseDto)
  @Get('/')
  async getTeams(@Query() query: TeamSearchQueryDto) {
    return this.adminTeamsService.getTeams(query);
  }
}

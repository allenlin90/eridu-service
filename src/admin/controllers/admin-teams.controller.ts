import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { CreateTeamDto } from '@/teams/dtos/create-team.dto';
import { TeamSearchQueryDto } from '@/teams/dtos/team-search-query.dto';
import { TeamListResponseDto } from '@/teams/dtos/team-list-response.dto';
import { TeamResponseDto } from '@/teams/dtos/team-response.dto';
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

  @Serialize(TeamResponseDto)
  @Post('/')
  async createTeam(@Body() data: CreateTeamDto) {
    return this.adminTeamsService.create(data);
  }

  @Serialize(TeamResponseDto)
  @Get('/:team_id')
  async getOneTeam(@Param('team_id') teamId: string) {
    return this.adminTeamsService.findUnique(teamId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:team_id')
  async deleteOneBusiness(@Param('team_id') teamId: string) {
    return this.adminTeamsService.delete(teamId);
  }
}

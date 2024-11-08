import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamRepository } from './teams.repository';

@Module({
  providers: [TeamsService, TeamRepository],
  exports: [TeamsService],
})
export class TeamsModule {}

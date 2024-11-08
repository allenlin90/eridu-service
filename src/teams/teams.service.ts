import { Injectable } from '@nestjs/common';
import { TeamRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(private teamRepository: TeamRepository) {}

  get create() {
    return this.teamRepository.create;
  }
}

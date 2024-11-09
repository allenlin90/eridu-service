import { Injectable } from '@nestjs/common';

import { Prefixes } from '@/constants';
import { NanoIdService } from '@/nano-id/nano-id.service';
import { MembershipsRepository } from './memberships.repository';
import { CreateMembershipDto } from './dtos/create-membership.dto';
import { MembershipSearchQueryDto } from './dtos/membership-search.query.dto';

@Injectable()
export class MembershipsService {
  constructor(
    private nanoId: NanoIdService,
    private membershipsRepository: MembershipsRepository,
  ) {}

  async searchMemberships(query: MembershipSearchQueryDto) {
    return this.membershipsRepository.searchMemberships(query);
  }

  async create(data: CreateMembershipDto) {
    const { team_id, role_id, user_id, type } = data;
    let uid = data.uid;

    if (!uid) {
      uid = `${Prefixes.MEMBERSHIP}_${this.nanoId.generate()}`;
    }

    return this.membershipsRepository.create({
      data: {
        uid,
        type: type || 'member',
        user: { connect: { uid: user_id } },
        role: { connect: { uid: role_id } },
        team: { connect: { uid: team_id } },
      },
    });
  }
}

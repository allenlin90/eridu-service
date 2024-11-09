import { Injectable } from '@nestjs/common';
import { MembershipsService } from '@/memberships/memberships.service';
import { CreateMembershipDto } from '@/memberships/dtos/create-membership.dto';
import { MembershipSearchQueryDto } from '@/memberships/dtos/membership-search.query.dto';

@Injectable()
export class AdminMembershipsService {
  constructor(private membershipsService: MembershipsService) {}

  async create(data: CreateMembershipDto) {
    return this.membershipsService.createMembershipWithPermissionCacheUpdate(
      data,
    );
  }

  async getMemberships(query: MembershipSearchQueryDto) {
    return this.membershipsService.searchMemberships(query);
  }
}

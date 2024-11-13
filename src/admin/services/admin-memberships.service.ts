import { Injectable } from '@nestjs/common';
import { MembershipsService } from '@/memberships/memberships.service';
import { CreateMembershipDto } from '@/memberships/dtos/create-membership.dto';
import { MembershipSearchQueryDto } from '@/memberships/dtos/membership-search.query.dto';
import { UpdateMembershipDto } from '@/memberships/dtos/update-membership.dto';

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

  async findUnique(membershipId: string) {
    return this.membershipsService.findUnique({ where: { uid: membershipId } });
  }

  async update(membershipId: string, data: UpdateMembershipDto) {
    return this.membershipsService.updateMembershipWithPermissionCacheUpdate(
      membershipId,
      data,
    );
  }

  async delete(membershipId: string) {
    return this.membershipsService.delete({ uid: membershipId });
  }
}

import { Injectable } from '@nestjs/common';
import { MembershipsService } from '@/memberships/memberships.service';
import { CreateMembershipDto } from '@/memberships/dtos/create-membership.dto';

@Injectable()
export class AdminMembershipsService {
  constructor(private membershipsService: MembershipsService) {}

  async create(data: CreateMembershipDto) {
    return this.membershipsService.create(data);
  }
}

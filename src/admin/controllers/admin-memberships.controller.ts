import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/guards/auth.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { CreateMembershipDto } from '@/memberships/dtos/create-membership.dto';
import { MembershipResponseDto } from '@/memberships/dtos/membership-response.dto';
import { AdminMembershipsService } from '../services/admin-memberships.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/memberships')
export class AdminMembershipsController {
  constructor(private adminMembershipsService: AdminMembershipsService) {}

  @Serialize(MembershipResponseDto)
  @Post('/')
  async createMembership(@Body() data: CreateMembershipDto) {
    return this.adminMembershipsService.create(data);
  }
}

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
import { AdminMembershipsService } from '../services/admin-memberships.service';
import { CreateMembershipDto } from '@/memberships/dtos/create-membership.dto';
import { MembershipResponseDto } from '@/memberships/dtos/membership-response.dto';
import { MembershipSearchQueryDto } from '@/memberships/dtos/membership-search.query.dto';
import { MembershipListResponseDto } from '@/memberships/dtos/membership-list-response.dto';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/memberships')
export class AdminMembershipsController {
  constructor(private adminMembershipsService: AdminMembershipsService) {}

  @Serialize(MembershipResponseDto)
  @Post('/')
  async createMembership(@Body() data: CreateMembershipDto) {
    return this.adminMembershipsService.create(data);
  }

  @Serialize(MembershipListResponseDto)
  @Get('/')
  async getMemberships(@Query() query: MembershipSearchQueryDto) {
    return this.adminMembershipsService.getMemberships(query);
  }

  @Serialize(MembershipResponseDto)
  @Get('/:membership_id')
  async findOneMembership(@Param('membership_id') membershipId: string) {
    return this.adminMembershipsService.findUnique(membershipId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:membership_id')
  async deleteOneMembership(@Param('membership_id') membershipId: string) {
    return this.adminMembershipsService.delete(membershipId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { UpdateMembershipDto } from '@/memberships/dtos/update-membership.dto';

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

  @Serialize(MembershipResponseDto)
  @Put('/:membership_id')
  async updateOneMembership(
    @Param('membership_id') membershipId: string,
    @Body() data: UpdateMembershipDto,
  ) {
    return this.adminMembershipsService.update(membershipId, data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:membership_id')
  async deleteOneMembership(@Param('membership_id') membershipId: string) {
    return this.adminMembershipsService.delete(membershipId);
  }
}

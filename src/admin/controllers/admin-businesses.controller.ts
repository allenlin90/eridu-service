import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminGuard } from '@/guards/admin.guard';
import { AuthGuard } from '@/guards/auth.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';

import { CreateBusinessDto } from '../dtos/create-business.dto';
import { BusinessResponseDto } from '@/businesses/dtos/business-response.dto';
import { BusinessListResponseDto } from '@/businesses/dtos/business-list-response.dto';
import { BusinessSearchQueryDto } from '@/businesses/dtos/business-search-query.dto';
import { CreateTeamDto } from '@/teams/dtos/create-team.dto';

import { AdminBusinessesService } from '@/admin/services/admin-businesses.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/businesses')
export class AdminBusinessesController {
  constructor(private adminBusinessesService: AdminBusinessesService) {}

  @Serialize(BusinessListResponseDto)
  @Get('/')
  async getBusinesses(@Query() query: BusinessSearchQueryDto) {
    return this.adminBusinessesService.getBusinesses(query);
  }

  @Serialize(BusinessResponseDto)
  @Post('/')
  async createBusiness(@Body() args: CreateBusinessDto) {
    return this.adminBusinessesService.createBusiness(args);
  }

  @Post(':business_id/teams')
  async createTeam(
    @Param('business_id') businessId: string,
    @Body() args: CreateTeamDto,
  ) {
    return this.adminBusinessesService.createTeam(businessId, args);
  }
}

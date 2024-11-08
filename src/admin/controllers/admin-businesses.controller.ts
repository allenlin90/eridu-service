import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { AdminGuard } from '@/guards/admin.guard';
import { AuthGuard } from '@/guards/auth.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';

import { CreateBusinessDto } from '../../businesses/dtos/create-business.dto';
import { BusinessResponseDto } from '@/businesses/dtos/business-response.dto';
import { BusinessListResponseDto } from '@/businesses/dtos/business-list-response.dto';
import { BusinessSearchQueryDto } from '@/businesses/dtos/business-search-query.dto';

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
}

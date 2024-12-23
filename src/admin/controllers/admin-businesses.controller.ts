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

import { AdminGuard } from '@/guards/admin.guard';
import { AuthGuard } from '@/guards/auth.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';

import { CreateBusinessDto } from '../../businesses/dtos/create-business.dto';
import { BusinessResponseDto } from '@/businesses/dtos/business-response.dto';
import { BusinessListResponseDto } from '@/businesses/dtos/business-list-response.dto';
import { BusinessSearchQueryDto } from '@/businesses/dtos/business-search-query.dto';

import { AdminBusinessesService } from '@/admin/services/admin-businesses.service';
import { UpdateBusinessDto } from '@/businesses/dtos/update-business.dto';

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
    return this.adminBusinessesService.create(args);
  }

  @Serialize(BusinessResponseDto)
  @Get('/:business_id')
  async getOneBusiness(@Param('business_id') businessId: string) {
    return this.adminBusinessesService.findUnique(businessId);
  }

  @Serialize(BusinessResponseDto)
  @Put('/:business_id')
  async updateOneBusiness(
    @Param('business_id') businessId: string,
    @Body() data: UpdateBusinessDto,
  ) {
    return this.adminBusinessesService.update(businessId, data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:business_id')
  async deleteOneBusiness(@Param('business_id') businessId: string) {
    return this.adminBusinessesService.delete(businessId);
  }
}

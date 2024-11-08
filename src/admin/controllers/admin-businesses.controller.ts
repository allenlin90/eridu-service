import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AdminGuard } from '@/guards/admin.guard';
import { AuthGuard } from '@/guards/auth.guard';
import { Serialize } from '@/interceptors/serialize.interceptor';

import { CreateBusinessDto } from '../dtos/create-business.dto';
import { BusinessResponseDto } from '../dtos/business-response.dto';

import { AdminBusinessesService } from '../services/admin-businesses.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/businesses')
export class AdminBusinessesController {
  constructor(private adminBusinessesService: AdminBusinessesService) {}

  @Serialize(BusinessResponseDto)
  @Post('/')
  async createBusiness(@Body() args: CreateBusinessDto) {
    return this.adminBusinessesService.createBusiness(args);
  }
}

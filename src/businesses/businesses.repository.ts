import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { Business } from '@prisma/client';
import { Entities, Tables, BUSINESS_SEARCH_COLUMNS } from '@/constants';
import { BusinessSearchQueryDto } from './dtos/business-search-query.dto';

@Injectable()
export class BusinessesRepository {
  constructor(private prisma: PrismaService) {}

  get findUnique() {
    return this.prisma.business.findUnique;
  }

  get create() {
    return this.prisma.business.create;
  }

  @PaginationSearch<Business, BusinessSearchQueryDto>(
    Entities.BUSINESS,
    Tables.BUSINESSES,
    BUSINESS_SEARCH_COLUMNS,
  )
  async searchBusinesses(_query: BusinessSearchQueryDto) {}
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { Business, Prisma } from '@prisma/client';
import { Entities, Tables, BUSINESS_SEARCH_COLUMNS } from '@/constants';
import { BusinessSearchQueryDto } from './dtos/business-search-query.dto';

@Injectable()
export class BusinessesRepository {
  constructor(private prisma: PrismaService) {}

  get findUnique() {
    return this.prisma.client.business.findUnique;
  }

  get create() {
    // TODO: update with soft delete to re-use created entity
    return this.prisma.client.business.upsert;
  }

  get update() {
    return this.prisma.client.business.update;
  }

  get delete() {
    return this.prisma.client.business.delete;
  }

  @PaginationSearch<Business, BusinessSearchQueryDto>(
    Entities.BUSINESS,
    Tables.BUSINESSES,
    BUSINESS_SEARCH_COLUMNS,
  )
  async searchBusinesses(_query: BusinessSearchQueryDto) {}
}

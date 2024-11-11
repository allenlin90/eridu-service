import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type {
  paginator as Paginator,
  PaginatorTypes,
  searchPaginator as SearchPaginator,
} from '@nodeteam/nestjs-prisma-pagination';
import { ProviderKeys } from '@/constants';
import { PrismaExtendedClient } from './prisma.extensions';

const defaultPaginateOptions = { page: 1, perPage: 10 };

@Injectable()
export class PrismaService
  extends PrismaExtendedClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(ProviderKeys.PRISMA_PAGINATOR) private paginator: typeof Paginator,
    @Inject(ProviderKeys.PRISMA_SEARCH_PAGINATOR)
    private searchPaginator: typeof SearchPaginator,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  applyPaginator(defaultOptions?: PaginatorTypes.PaginateOptions) {
    return this.paginator({ ...defaultPaginateOptions, ...defaultOptions });
  }

  applySearchPaginator(defaultOptions?: PaginatorTypes.SearchPaginateOptions) {
    return this.searchPaginator({
      ...defaultPaginateOptions,
      ...defaultOptions,
    });
  }
}

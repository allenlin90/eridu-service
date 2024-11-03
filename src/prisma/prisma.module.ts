import { Global, Module } from '@nestjs/common';
import { paginator, searchPaginator } from '@nodeteam/nestjs-prisma-pagination';

import { ProviderKeys } from '@/constants';
import { PrismaService } from '@/prisma/prisma.service';

@Global()
@Module({
  providers: [
    { provide: ProviderKeys.PRISMA_PAGINATOR, useValue: paginator },
    {
      provide: ProviderKeys.PRISMA_SEARCH_PAGINATOR,
      useValue: searchPaginator,
    },
    PrismaService,
  ],
  exports: [PrismaService],
})
export class PrismaModule {}

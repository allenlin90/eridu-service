import { NanoIdService } from '@/nano-id/nano-id.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { Prefixes } from '@/constants';
import { BusinessesRepository } from './businesses.repository';
import { BusinessSearchQueryDto } from './dtos/business-search-query.dto';

@Injectable()
export class BusinessesService {
  constructor(
    private nanoIdService: NanoIdService,
    private businessesRepository: BusinessesRepository,
  ) {}

  get findUnique() {
    return this.businessesRepository.findUnique;
  }

  // TODO: optimize this with proper soft delete and cascading solution
  async delete(where: Prisma.BusinessWhereUniqueInput) {
    return this.businessesRepository.transaction(async (tx) => {
      const business = await tx.business.findUnique({
        where,
        include: {
          roles: true,
          features: true,
          teams: {
            include: {
              memberships: {
                include: { user: true },
              },
            },
          },
        },
      });

      if (!business) {
        throw new NotFoundException(`business ID: ${where.uid} not found`);
      }

      const businessId = business.id;
      const teamIds = business.teams.map((t) => t.id);

      await tx.business.delete({ where: { id: businessId } });

      await tx.feature.deleteMany({ where: { businessId } });

      await tx.role.deleteMany({ where: { businessId } });

      await tx.team.deleteMany({ where: { businessId } });

      await tx.membership.deleteMany({ where: { teamId: { in: teamIds } } });

      // TODO: refactor to be done as side-effect e.g. decorator
      // TODO: optimize this to prevent performance bottleneck
      const userIds = business.teams
        .reduce((list, team) => list.concat(team.memberships), [])
        .map((m) => m.userId);
      await tx.permissionsCache.deleteMany({
        where: { userId: { in: userIds } },
      });

      return business;
    });
  }

  async update(query: Prisma.BusinessUpdateArgs) {
    return this.businessesRepository.transaction(async (tx) => {
      const business = (await tx.business.update({
        ...query,
        include: {
          teams: {
            include: {
              memberships: {
                include: { user: true },
              },
            },
          },
        },
      })) as Prisma.BusinessGetPayload<{
        include: {
          teams: {
            include: {
              memberships: {
                include: { user: true };
              };
            };
          };
        };
      }>;

      // TODO: refactor to be done as side-effect e.g. decorator
      // TODO: optimize this to prevent performance bottleneck
      const userIds = business.teams
        .reduce((list, team) => list.concat(team.memberships), [])
        .map((m) => m.userId);
      await tx.permissionsCache.deleteMany({
        where: { userId: { in: userIds } },
      });

      return business;
    });
  }

  async getBusinesses(query: BusinessSearchQueryDto) {
    return this.businessesRepository.searchBusinesses(query);
  }

  async create(data: Prisma.BusinessCreateInput) {
    let uid = data.uid;

    if (!uid) {
      uid = `${Prefixes.BUSINESS}_${this.nanoIdService.generate()}`;
    }

    return this.businessesRepository.create({
      where: { name: data.name },
      update: { deletedAt: null },
      create: { ...data },
    });
  }
}

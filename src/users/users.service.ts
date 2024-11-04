import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

import { Entities, Tables, USER_SEARCH_COLUMNS } from '@/constants';
import { PaginationSearch } from '@/decorators/paginatoin-search.decorator';
import { UserSearchQueryDto } from './dtos/user-search-query.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  @PaginationSearch<User, UserSearchQueryDto>(
    Entities.USER,
    Tables.USERS,
    USER_SEARCH_COLUMNS,
  )
  async searchUsers(_query: UserSearchQueryDto) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Updates a user with the specified data and unique identifier.
   * @param {object} params
   * @param {Prisma.UserUpdateInput} params.data - The data to update the user with.
   * @param {Prisma.UserWhereUniqueInput} params.where - The unique identifier to locate the user.
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   */
  update(params: {
    data: Prisma.UserUpdateInput;
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    return this.prisma.user.update(params);
  }
}

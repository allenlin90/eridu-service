import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { PaginationQueryDto } from '@/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  async searchUsers({
    page = 1,
    perPage = 10,
    skip = 0,
    searchValue,
  }: PaginationQueryDto): Promise<PaginatorTypes.PaginatedResult<User>> {
    const searchColumns: (keyof User)[] = ['email', 'username', 'uid'];
    const searchPaginator = this.prisma.applySearchPaginator();

    const users = await searchPaginator<User>(this.prisma, 'users', {
      page,
      perPage,
      skip,
      searchValue,
      searchColumns,
    });

    return users;
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update({
    data,
    where,
  }: {
    data: Prisma.UserUpdateInput;
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    return this.prisma.user.update({ data, where });
  }
}

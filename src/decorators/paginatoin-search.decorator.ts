import type { PaginationQueryDto } from '@/dto/pagination.dto';
import type { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';

export function PaginationSearch<T, K extends PaginationQueryDto>(
  entityName: string,
  tableName: string,
  searchColumns: string[],
) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // const _originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const { search, filters, ...options } = args[0] as K;

      if (!search) {
        const paginator = this.prisma.applyPaginator();

        return paginator(
          this.prisma[entityName],
          { where: { ...filters, deletedAt: null } },
          options,
        );
      }

      // TODO: mapping columns and fields in snake_case to camelCase according to schema
      const searchPaginator: PaginatorTypes.SearchPaginateFunction =
        this.prisma.applySearchPaginator();

      return searchPaginator<T>(this.prisma, tableName, {
        page: 1,
        perPage: 10,
        skip: 0,
        searchColumns,
        searchValue: search,
        ...options,
      });
    };
    return descriptor;
  };
}

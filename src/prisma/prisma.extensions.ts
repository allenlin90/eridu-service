import { Prisma, PrismaClient } from '@prisma/client';

export class PrismaExtendedClient extends PrismaClient {
  extendedClient: ReturnType<typeof extendedClient>;
  constructor(...args: ConstructorParameters<typeof PrismaClient>) {
    super(...args);
  }

  get client() {
    if (!this.extendedClient) {
      this.extendedClient = extendedClient(this);
    }

    return this.extendedClient;
  }
}

export const extendedClient = (client: PrismaClient) => {
  return client
    .$extends(softDelete)
    .$extends(softDeleteMany)
    .$extends(filterSoftDeleted);
};

//extension for soft delete
export const softDelete = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    $allModels: {
      async delete<M, A>(
        this: M,
        where: Prisma.Args<M, 'delete'>['where'],
      ): Promise<Prisma.Result<M, A, 'update'>> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).update({
          where: {
            ...where,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});

//extension for soft delete Many
export const softDeleteMany = Prisma.defineExtension({
  name: 'softDeleteMany',
  model: {
    $allModels: {
      async deleteMany<M, A>(
        this: M,
        where: Prisma.Args<M, 'deleteMany'>['where'],
      ): Promise<Prisma.Result<M, A, 'updateMany'>> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).updateMany({
          where: {
            ...where,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});

//extension for filtering soft deleted rows from queries
export const filterSoftDeleted = Prisma.defineExtension({
  name: 'filterSoftDeleted',
  query: {
    $allModels: {
      async $allOperations({ model: _model, operation, args, query }) {
        if (
          operation === 'findUnique' ||
          operation === 'findFirst' ||
          operation === 'findMany'
        ) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        }
        return query(args);
      },
    },
  },
});

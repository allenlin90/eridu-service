import { Prisma, PrismaClient } from '@prisma/client';

export class PrismaExtendedClient extends PrismaClient {
  private extendedClient: ReturnType<typeof extendedClient>;

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
    user: { delete: deleteFunc },
    refreshToken: { delete: deleteFunc },
    resetToken: { delete: deleteFunc },
    business: { delete: deleteFunc },
    feature: { delete: deleteFunc },
    userFeature: { delete: deleteFunc },
    role: { delete: deleteFunc },
    team: { delete: deleteFunc },
    membership: { delete: deleteFunc },
  },
});

async function deleteFunc<M, A>(
  this: M,
  where: Prisma.Args<M, 'delete'>['where'],
): Promise<Prisma.Result<M, A, 'update'>> {
  // TODO: refactor this, caused when using interactive transactions
  const filters = where?.where ?? where;
  const context = Prisma.getExtensionContext(this);

  return (context as any).update({
    where: {
      ...filters,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

//extension for soft delete Many
export const softDeleteMany = Prisma.defineExtension({
  name: 'softDeleteMany',
  model: {
    user: { delete: deleteMany },
    refreshToken: { delete: deleteMany },
    resetToken: { delete: deleteMany },
    business: { delete: deleteMany },
    feature: { delete: deleteMany },
    userFeature: { delete: deleteMany },
    role: { delete: deleteMany },
    team: { delete: deleteMany },
    membership: { delete: deleteMany },
  },
});

async function deleteMany<M, A>(
  this: M,
  where: Prisma.Args<M, 'deleteMany'>['where'],
): Promise<Prisma.Result<M, A, 'updateMany'>> {
  // TODO: refactor this, is caused when using interactive transactions
  const filters = where?.where ?? where;
  const context = Prisma.getExtensionContext(this);

  return (context as any).updateMany({
    where: {
      ...filters,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

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

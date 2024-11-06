import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '@/constants';

export function HandlePrismaNotFoundError() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalGetter = descriptor.get;

    descriptor.get = function () {
      const originalMethod = originalGetter.call(this);

      return async (...args: any[]) => {
        try {
          const result = await originalMethod.call(this.prisma, ...args);
          return result;
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === PrismaErrorCodes.NOT_FOUND
          ) {
            return null;
          }
          throw error;
        }
      };
    };
  };
}

import { Prisma } from '@prisma/client';
import { PrismaErrorCodes } from '@/constants';

export function HandlePrismaNotFoundError() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.NOT_FOUND) {
            return null;
          }
        }
        throw error;
      }
    };

    return descriptor;
  };
}

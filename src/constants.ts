export enum ProviderKeys {
  NANO_ID = 'NANO_ID',
  PRISMA_PAGINATOR = 'PRISMA_PAGINATOR',
  PRISMA_SEARCH_PAGINATOR = 'PRISMA_SEARCH_PAGINATOR',
}

export enum Prefixes {
  BUSINESS = 'biz',
  ERIFY = 'erify',
  USER = 'user',
  RESET = 'reset',
  REFRESH = 'refresh',
}

export enum PrismaErrorCodes {
  NOT_FOUND = 'P2025',
}

export enum Entities {
  BUSINESS = 'business',
  USER = 'user',
}

export enum Tables {
  BUSINESSES = 'businesses',
  USERS = 'users',
}

export const BUSINESS_SEARCH_COLUMNS = ['name', 'uid'];
export const USER_SEARCH_COLUMNS = ['email', 'username', 'uid'];

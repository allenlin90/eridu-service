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
  USER = 'user',
}

export enum Tables {
  USERS = 'users',
}

export const USER_SEARCH_COLUMNS = ['email', 'username', 'uid'];

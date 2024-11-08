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
  TEAM = 'team',
  MEMBERSHIP = 'membership',
}

export enum PrismaErrorCodes {
  NOT_FOUND = 'P2025',
}

export enum Entities {
  BUSINESS = 'business',
  USER = 'user',
  TEAM = 'team',
}

export enum Tables {
  BUSINESSES = 'businesses',
  USERS = 'users',
  TEAMS = 'teams',
}

export const BUSINESS_SEARCH_COLUMNS = ['name', 'uid'];
export const TEAM_SEARCH_COLUMNS = ['name', 'uid'];
export const USER_SEARCH_COLUMNS = ['email', 'username', 'uid'];

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
  ROLE = 'role',
}

export enum PrismaErrorCodes {
  NOT_FOUND = 'P2025',
}

export enum Entities {
  BUSINESS = 'business',
  USER = 'user',
  TEAM = 'team',
  MEMBERSHIP = 'membership',
  ROLE = 'role',
}

export enum Tables {
  BUSINESSES = 'businesses',
  USERS = 'users',
  TEAMS = 'teams',
  MEMBERSHIPS = 'memberships',
  ROLES = 'role',
}

export const BUSINESS_SEARCH_COLUMNS = ['name', 'uid'];
export const TEAM_SEARCH_COLUMNS = ['name', 'uid'];
export const USER_SEARCH_COLUMNS = ['email', 'username', 'uid'];
export const MEMBERSHIP_SEARCH_COLUMNS = ['type', 'uid'];

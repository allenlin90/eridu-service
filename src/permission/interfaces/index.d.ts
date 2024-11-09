import type { Prisma } from '@prisma/client';

export interface UserPermissions {
  [team_id: string]: {
    business_id: string;
    business_name: string;
    team_id: string;
    team_name: string;
    scope: string[];
  };
}

export type UserExpandedPayload = Prisma.UserGetPayload<{
  include: {
    memberships: {
      include: {
        role: true;
        team: { include: { business: true } };
      };
    };
  };
}>;

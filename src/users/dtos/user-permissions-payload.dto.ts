import { IsArray, IsObject } from 'class-validator';

import { Business, Membership, Role, Team, User } from '@prisma/client';

// TODO: enforce data and model validation
export class UserPermissionsPayloadDto {
  @IsObject()
  user: User;

  @IsArray({ each: true })
  teams: Team[];

  @IsArray({ each: true })
  memberships: Membership[];

  @IsArray({ each: true })
  businesses: Business[];

  @IsArray({ each: true })
  roles: Role[];
}

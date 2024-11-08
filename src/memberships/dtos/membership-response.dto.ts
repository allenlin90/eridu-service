import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class MembershipResponseDto {
  @Expose({ name: 'uid' })
  @IsString()
  id: string;

  @Expose()
  @IsString()
  type: string;

  // TODO: serialize user, team, and role_id to uid
  // expand to include user, team, and role object

  @Expose()
  @IsString()
  createdAt: string;

  @Expose()
  @IsString()
  updatedAt: string;
}

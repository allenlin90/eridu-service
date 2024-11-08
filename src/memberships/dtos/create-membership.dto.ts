import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMembershipDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  role_id: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  team_id: string;
}

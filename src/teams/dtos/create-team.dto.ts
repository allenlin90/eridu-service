import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  business_id: string;

  @IsOptional()
  @IsString()
  parent_team_id?: string;
}

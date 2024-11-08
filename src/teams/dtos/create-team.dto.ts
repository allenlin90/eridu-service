import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  parent_team_id?: string;
}

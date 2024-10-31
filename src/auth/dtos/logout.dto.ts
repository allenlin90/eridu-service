import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  refreshToken: string;
}

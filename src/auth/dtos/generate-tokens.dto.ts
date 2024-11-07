import type { RefreshToken } from '@prisma/client';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

// TODO: enforce data and model validation
export class GenerateTokensDto {
  @IsNumber()
  userId: number;

  @IsObject()
  @IsOptional()
  refreshToken?: RefreshToken;

  @IsString()
  @IsOptional()
  permissionVersion?: string;
}

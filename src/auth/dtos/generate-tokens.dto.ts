import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { RefreshToken } from 'prisma/generated/models';

export class GenerateTokensDto {
  @IsNumber()
  userId: number;

  @Type(() => RefreshToken)
  @IsOptional()
  refreshToken?: RefreshToken;
}

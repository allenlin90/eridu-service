import { Expose, Type } from 'class-transformer';

import { Team } from '@prisma/client';
import { PaginationMetaDto } from '@/dto/pagination.dto';
import { TeamResponseDto } from './team-response.dto';

export class TeamListResponseDto extends PaginationMetaDto {
  @Expose()
  @Type(() => TeamResponseDto)
  data: Team[];
}

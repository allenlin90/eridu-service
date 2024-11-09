import { Expose, Type } from 'class-transformer';

import { Role } from '@prisma/client';
import { PaginationMetaDto } from '@/dto/pagination.dto';
import { RoleResponseDto } from './role-response.dto';

export class RoleListResponseDto extends PaginationMetaDto {
  @Expose()
  @Type(() => RoleResponseDto)
  data: Role[];
}

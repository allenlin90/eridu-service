import { Expose, Type } from 'class-transformer';

import { Business } from '@prisma/client';
import { PaginationMetaDto } from '@/dto/pagination.dto';
import { BusinessResponseDto } from './business-response.dto';

export class BusinessListResponseDto extends PaginationMetaDto {
  @Expose()
  @Type(() => BusinessResponseDto)
  data: Business[];
}

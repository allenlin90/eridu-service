import { Expose, Type } from 'class-transformer';

import { Membership } from '@prisma/client';
import { PaginationMetaDto } from '@/dto/pagination.dto';
import { MembershipResponseDto } from './membership-response.dto';

export class MembershipListResponseDto extends PaginationMetaDto {
  @Expose()
  @Type(() => MembershipResponseDto)
  data: Membership[];
}

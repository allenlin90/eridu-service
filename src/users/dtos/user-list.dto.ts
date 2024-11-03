import { Expose, Type } from 'class-transformer';
import { User } from '@prisma/client';

import { PaginationMetaDto } from '@/dto/pagination.dto';
import { UserResponseDto } from './user-response.dto';

export class UserListDto extends PaginationMetaDto {
  @Expose()
  @Type(() => UserResponseDto)
  data: User[];
}

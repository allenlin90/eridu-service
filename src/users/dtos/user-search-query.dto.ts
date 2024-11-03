import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';
import { PaginationQueryDto } from '@/dto/pagination.dto';

class UserFilters {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAdmin: boolean;
}

export class UserSearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilters)
  filters: UserFilters;
}

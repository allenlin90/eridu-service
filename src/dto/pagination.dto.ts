import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  skip: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  perPage: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsObject()
  filters: Record<string, any>;
}

export class PaginationDto {
  @IsNumber()
  total: number;

  @IsNumber()
  lastPage: number;

  @IsNumber()
  currentPage: number;

  @IsNumber()
  perPage: number;

  @IsOptional()
  @IsNumber()
  prev: number | null;

  @IsOptional()
  @IsNumber()
  next: number | null;
}

export abstract class PaginationMetaDto {
  @Expose()
  meta: PaginationDto;
}

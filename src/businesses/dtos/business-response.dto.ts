import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class BusinessResponseDto {
  @Expose({ name: 'uid' })
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  createdAt: string;

  @Expose()
  @IsString()
  updatedAt: string;
}

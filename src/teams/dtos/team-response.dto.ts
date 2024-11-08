import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class TeamResponseDto {
  @Expose({ name: 'uid' })
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  // TODO: serialize business_id to business_uid
  // expand to include business object

  @Expose()
  @IsString()
  createdAt: string;

  @Expose()
  @IsString()
  updatedAt: string;
}

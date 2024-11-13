import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

// at least one of type or role_id is required
export class UpdateMembershipDto {
  @ValidateIf((o) => !o.role_id || !!o.type)
  @IsNotEmpty()
  @IsString()
  type?: string;

  @ValidateIf((o) => !o.type || !!o.role_id)
  @IsNotEmpty()
  @IsString()
  role_id?: string;
}

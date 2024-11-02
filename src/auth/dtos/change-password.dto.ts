import { IsString, Matches, MinLength } from 'class-validator';
import { Match } from '@/decorators/match.decorator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)/, {
    message: 'password must contain at least one number',
  })
  newPassword: string;

  @IsString()
  @Match('newPassword', { message: 'passwords do not match' })
  confirmNewPassword: string;
}

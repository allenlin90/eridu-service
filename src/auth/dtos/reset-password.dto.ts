import { IsString, MinLength, Matches } from 'class-validator';
import { Match } from '@/decorators/match.decorator';
import { IsPrefixedNanoID } from '@/decorators/prefixed-nanoid.decorator';
import { Prefixes } from '@/constants';

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)/, {
    message: 'password must contain at least one number',
  })
  password: string;

  @IsString()
  @Match('password', { message: 'passwords do not match' })
  confirmPassword: string;

  @IsString()
  @IsPrefixedNanoID(Prefixes.RESET)
  token: string;
}

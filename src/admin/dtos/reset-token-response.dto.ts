import { Expose } from 'class-transformer';

export class ResetTokenResponseDto {
  @Expose({ name: 'uid' })
  resetToken: string;
}

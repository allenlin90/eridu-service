import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose({ name: 'uid' })
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

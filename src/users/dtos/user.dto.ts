import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  uid: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

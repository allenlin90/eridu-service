import type { nanoid as nanoId } from 'nanoid';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ProviderKeys } from '@/constants';
import { UsersService } from '@/users/users.service';
import { SignupDto } from './dtos/signup.dto';
import { EncryptionService } from './encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private encryptionService: EncryptionService,
    private usersService: UsersService,
    @Inject(ProviderKeys.NANO_ID) private nanoid: typeof nanoId,
  ) {}

  async signupLocal(signupDto: SignupDto) {
    return this.signupUser(signupDto);
  }

  private async hashPassword(password: string) {
    return this.encryptionService.hash(password, 10);
  }

  private async signupUser({ email, password, ...objectData }: SignupDto) {
    const emailInUse = await this.usersService.findOne({ email });

    if (emailInUse) {
      throw new BadRequestException('user already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersService.create({
      uid: `user_${this.nanoid()}`,
      email,
      password: hashedPassword,
      ...objectData,
    });

    return user;
  }
}

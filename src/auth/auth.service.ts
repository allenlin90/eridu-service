import type { nanoid as nanoId } from 'nanoid';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ProviderKeys } from '@/constants';
import { UsersService } from '@/users/users.service';
import { SignupDto } from './dtos/signup.dto';
import { EncryptionService } from './encryption.service';
import { LoginDto } from './dtos/login.dto';

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

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    await this.validatePassword(password, user.password);

    this.generateTokens(user.uid);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const isMatch = await this.encryptionService.compare(
      password,
      hashedPassword,
    );

    if (!isMatch) {
      throw new BadRequestException('invalid credentials');
    }
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

    return this.generateTokens(user.uid);
  }

  private async generateTokens(userUid: string) {
    // TODO: generate access and refresh token
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';

    return { accessToken, refreshToken };
  }
}

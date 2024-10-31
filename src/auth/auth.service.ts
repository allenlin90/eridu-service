import type { nanoid as nanoId } from 'nanoid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ProviderKeys } from '@/constants';
import { ConfigKeys } from '@/config';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { EncryptionService } from './encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private usersService: UsersService,
    private encryptionService: EncryptionService,
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

    return this.generateTokens(user.uid);
  }

  async logout(tokens: LogoutDto) {
    // TODO: blacklist access token
    const { refreshToken } = tokens;

    // TODO: soft delete or log deleting action
    const deletedRefreshToken = await this.prisma.refreshToken.delete({
      where: { uid: refreshToken },
    });

    return deletedRefreshToken;
  }

  async generateRefreshToken(userUid: string) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.REFRESH_TOKEN_EXPIRES_IN,
    );
    expiryDate.setDate(expiryDate.getDate() + expiresIn);

    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        user: { connect: { uid: userUid } },
        uid: `refresh_${this.nanoid()}`,
        expiryDate,
      },
    });

    return refreshToken;
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

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId });

    const refreshToken = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }
}

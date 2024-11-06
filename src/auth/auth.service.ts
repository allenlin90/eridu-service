import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { User } from '@prisma/client';
import { Prefixes } from '@/constants';
import { ConfigKeys } from '@/config';
import { UsersService } from '@/users/users.service';
import { AuthRepository } from './auth.repository';
import { EncryptionService } from './encryption.service';

import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { GenerateTokensDto } from './dtos/generate-tokens.dto';
import { NanoIdService } from '@/nano-id/nano-id.service';

type UserId = User['id'];

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private usersService: UsersService,
    private encryptionService: EncryptionService,
    private nanoIdService: NanoIdService,
  ) {}

  async signupLocal(signupDto: SignupDto) {
    return this.signupUser(signupDto);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    await this.validatePassword(password, user.password);

    return this.generateTokens({ userId: user.id });
  }

  async refreshToken(refreshTokenUid: string) {
    // TODO: invalidate used refresh token for safety
    const now = new Date();
    const refreshToken = await this.authRepository.findUniqueRefreshToken({
      where: { uid: refreshTokenUid, expiryDate: { gte: now } },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('invalid refresh token');
    }

    return this.generateTokens({ userId: refreshToken.userId });
  }

  async changePassword(
    userId: string,
    { oldPassword, newPassword, confirmNewPassword }: ChangePasswordDto,
  ) {
    if (oldPassword === newPassword) {
      throw new BadRequestException("your new password can't be the same");
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        "new password and confirmation password don't match",
      );
    }

    const user = await this.usersService.findUnique({ where: { uid: userId } });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    await this.validatePassword(oldPassword, user.password);

    // update new password
    const hashedPassword = await this.hashPassword(newPassword);

    const updatedUser = await this.usersService.update({
      data: { password: hashedPassword },
      where: { id: user.id },
    });

    return updatedUser;
  }

  async resetPassword({ token, password, confirmPassword }: ResetPasswordDto) {
    if (password !== confirmPassword) {
      throw new BadRequestException('passwords do not match');
    }

    const resetToken = await this.authRepository.deleteResetToken({
      where: { uid: token, expiryDate: { gte: new Date() } },
    });

    if (!resetToken) {
      throw new BadRequestException('invalid reset token');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersService.update({
      data: { password: hashedPassword },
      where: { id: resetToken.userId },
    });

    return user;
  }

  async logout(tokens: LogoutDto) {
    // TODO: blacklist access token
    const { refreshToken } = tokens;

    // TODO: soft delete or log deleting action
    const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
      where: { uid: refreshToken },
    });

    if (!deletedRefreshToken) {
      throw new UnauthorizedException('invalid refresh token');
    }

    return deletedRefreshToken;
  }

  async findUser(userId: string) {
    return this.usersService.findUnique({ where: { uid: userId } });
  }

  async generateResetToken(userId: string) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.RESET_TOKEN_EXPIRES_IN,
    );
    expiryDate.setHours(expiryDate.getHours() + expiresIn);

    const uid = `${Prefixes.RESET}_${this.nanoIdService.generate()}`;

    const resetToken = await this.authRepository.createResetToken({
      data: {
        uid,
        expiryDate,
        user: { connect: { uid: userId } },
      },
    });

    return resetToken;
  }

  private async generateRefreshToken(userId: UserId) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.REFRESH_TOKEN_EXPIRES_IN,
    );
    expiryDate.setDate(expiryDate.getDate() + expiresIn);

    const uid = `${Prefixes.REFRESH}_${this.nanoIdService.generate()}`;

    const refreshToken = await this.authRepository.createRefreshToken({
      data: {
        uid,
        expiryDate,
        user: { connect: { id: userId } },
      },
    });

    return refreshToken;
  }

  private async generateAccessToken(userId: UserId) {
    const iss = this.config.get<string>(ConfigKeys.JWT_ISSUER);

    const user = await this.usersService.findUnique({
      where: { id: userId },
      include: { permissionsCache: true },
    });

    let payload = user.permissionsCache?.permissions ?? null;

    if (!payload) {
      payload = await this.usersService.getUserPermissions({ userId });
    }

    // TODO: add 'aud' to specify client
    return this.jwtService.sign({
      iss,
      sub: user.uid,
      email: user.email,
      username: user.username,
      payload,
    });
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
    const emailInUse = await this.usersService.findUnique({ where: { email } });

    if (emailInUse) {
      throw new BadRequestException('user already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const uid = `${Prefixes.USER}_${this.nanoIdService.generate()}`;

    const user = await this.usersService.create({
      data: {
        uid,
        email,
        password: hashedPassword,
        ...objectData,
      },
    });

    return this.generateTokens({ userId: user.id });
  }

  private async generateTokens({ userId, refreshToken }: GenerateTokensDto) {
    const accessToken = await this.generateAccessToken(userId);

    if (
      refreshToken &&
      this.shouldCreateRefreshToken(refreshToken.expiryDate)
    ) {
      return { accessToken, refreshToken };
    }

    const newRefreshToken = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken: newRefreshToken };
  }

  private shouldCreateRefreshToken(expiryDate: Date) {
    const bufferTime = this.config.get<number>(
      ConfigKeys.REFRESH_TOKEN_BUFFER_TIME,
    );

    const now = new Date();
    now.setMinutes(now.getMinutes() + bufferTime);

    return expiryDate > now;
  }
}

import type { nanoid as nanoId } from 'nanoid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { User } from '@prisma/client';
import { Prefixes, ProviderKeys } from '@/constants';
import { ConfigKeys } from '@/config';
import { UsersService } from '@/users/users.service';
import { AuthRepository } from './auth.repository';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { EncryptionService } from './encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
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

    return this.generateTokens(user);
  }

  async refreshToken(refreshTokenUid: string) {
    // TODO: invalidate used refresh token for safety
    const refreshToken = await this.authRepository.findUniqueRefreshToken(
      refreshTokenUid,
    );

    if (!refreshToken) {
      throw new UnauthorizedException('invalid refresh token');
    }

    const accessToken = this.generateAccessToken(refreshToken.user);

    // should re-use generateTokens method
    return { accessToken, refreshToken };
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

    const user = await this.usersService.findOne({ uid: userId });

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

    const resetToken = await this.authRepository.findAndDeleteResetToken(token);

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
    const deletedRefreshToken =
      await this.authRepository.findAndDeleteRefreshToken(refreshToken);

    if (!deletedRefreshToken) {
      throw new UnauthorizedException('invalid refresh token');
    }

    return deletedRefreshToken;
  }

  async generateRefreshToken(user: User) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.REFRESH_TOKEN_EXPIRES_IN,
    );
    expiryDate.setDate(expiryDate.getDate() + expiresIn);

    const refreshToken = await this.authRepository.createRefreshToken({
      uid: `${Prefixes.REFRESH}_${this.nanoid()}`,
      expiryDate,
      user: { connect: { id: user.id } },
    });

    return refreshToken;
  }

  private generateAccessToken(user: User) {
    return this.jwtService.sign({ userId: user.uid });
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

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const accessToken = this.generateAccessToken(user);

    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }
}

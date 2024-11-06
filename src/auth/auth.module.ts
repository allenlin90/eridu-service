import { Module } from '@nestjs/common';

import { UsersModule } from '@/users/users.module';
import { NanoIdModule } from '@/nano-id/nano-id.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [UsersModule, NanoIdModule],
  providers: [AuthService, AuthRepository, EncryptionService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

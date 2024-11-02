import { nanoid } from 'nanoid';
import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { EncryptionService } from './encryption.service';
import { UsersModule } from '@/users/users.module';
import { ProviderKeys } from '@/constants';

@Module({
  providers: [
    AuthService,
    AuthRepository,
    EncryptionService,
    { provide: ProviderKeys.NANO_ID, useValue: nanoid },
  ],
  controllers: [AuthController],
  imports: [UsersModule],
  exports: [AuthService],
})
export class AuthModule {}

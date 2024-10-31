import { nanoid } from 'nanoid';
import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionService } from './encryption.service';
import { UsersModule } from '@/users/users.module';
import { ProviderKeys } from '@/constants';

@Module({
  providers: [
    AuthService,
    EncryptionService,
    { provide: ProviderKeys.NANO_ID, useValue: nanoid },
  ],
  controllers: [AuthController],
  imports: [UsersModule],
})
export class AuthModule {}

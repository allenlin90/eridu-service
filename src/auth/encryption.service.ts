import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  hash(data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }

  compare(password: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, storedPassword);
  }

  generateRandomBytes(size = 32): string {
    return randomBytes(size).toString('hex');
  }
}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

import { NanoIdModule } from '@/nano-id/nano-id.module';

@Module({
  imports: [NanoIdModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

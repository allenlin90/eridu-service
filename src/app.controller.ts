import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/healthz')
  health(): string {
    return `server is running at ${new Date().toISOString()}`;
  }
}

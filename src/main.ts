import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from '@/prisma-client-exception.filter';

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(PORT, () => {
    console.log(`Application running at port ${PORT}`);
  });
}
bootstrap();

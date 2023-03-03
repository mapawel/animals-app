import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppContentType } from './global-middlewares/app-content-type.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(AppContentType);
  await app.listen(3000);
}
bootstrap();

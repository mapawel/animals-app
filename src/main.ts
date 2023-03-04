import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppContentType } from './global-middlewares/app-content-type.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    // bodyParser: false, // to disable the body parser and allow the use of the body parser from the express
  });
  // app.use(bodyParser.json({ limit: '50mb' }));  to increase the limit of the body size for tests only
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(AppContentType);
  await app.listen(3000);
}
bootstrap();

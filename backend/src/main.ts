import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const publicPath = join(__dirname, '..', 'public');

  app.use(cookieParser());
  app.useStaticAssets(join(publicPath, 'images'), {
    prefix: '/public/images/',
  });
  app.useStaticAssets(join(publicPath, 'assets'), {
    prefix: '/public/assets/',
  });
  app.useStaticAssets(publicPath);

  // SPA fallback
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/graphql')) {
      return next();
    }

    if (!req.path.includes('.') && !req.path.startsWith('/graphql')) {
      res.sendFile(join(publicPath, 'index.html'));
    } else {
      next();
    }
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();

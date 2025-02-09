import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './errors/global.errors';
import * as express from 'express';
import bodyParser, { json, urlencoded } from 'body-parser';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.use('/stripe/webhook', express.json({ verify: (req, res, buf) => {
    (req as any).rawBody = buf;  // Store raw buffer
  }}));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

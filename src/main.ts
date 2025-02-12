import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './errors/global.errors';
import * as express from 'express';
import bodyParser, { json, urlencoded } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/stripe/webhook',
    express.json({
      verify: (req, res, buf) => {
        (req as any).rawBody = buf; // Store raw buffer
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('EhealthCare API')
    .setDescription('The EhealthCare API description')
    .setVersion('1.0')
    .addTag('EhealthCare')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

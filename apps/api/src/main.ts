import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

let app: INestApplication;

async function createApp(): Promise<INestApplication> {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    app.enableCors({
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    });

    const config = new DocumentBuilder()
      .setTitle('Knowledge Base API')
      .setDescription(
        'API para base de conhecimento com IA\n\n' +
          '**Autenticação:**\n' +
          '1. Primeiro, crie um usuário em POST /users/sync\n' +
          '2. Copie o _id retornado\n' +
          '3. Clique em "Authorize" e cole o _id no campo x-user-id',
      )
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-user-id',
          in: 'header',
          description: 'User ID obtido do endpoint /users/sync',
        },
        'x-user-id',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/help', app, document);

    await app.init();
  }
  return app;
}

// Para desenvolvimento local
async function bootstrap(): Promise<void> {
  const nestApp = await createApp();
  await nestApp.listen(process.env.PORT ?? 3001);
}

// Para Vercel (serverless)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  const nestApp = await createApp();
  const expressApp = nestApp.getHttpAdapter().getInstance();
  return expressApp(req, res) as Promise<void>;
}

// Executa bootstrap apenas se não estiver em ambiente serverless
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  void bootstrap();
}

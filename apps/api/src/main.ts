import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

export async function setupApp(app: INestApplication) {
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
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();

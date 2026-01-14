import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './main';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);
  await app.init();

  const instance = app.getHttpAdapter().getInstance() as (
    req: Request,
    res: Response,
  ) => void;
  return instance(req, res);
}

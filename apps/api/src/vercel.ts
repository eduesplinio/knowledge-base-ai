import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './main';

export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);
  await app.init();

  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}

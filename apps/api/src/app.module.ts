import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SpacesModule } from './spaces/spaces.module';
import { ArticlesModule } from './articles/articles.module';
import { AiModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    UsersModule,
    SpacesModule,
    ArticlesModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { Space, SpaceSchema } from './schemas/space.schema';
import { Article, ArticleSchema } from '../articles/schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Space.name, schema: SpaceSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  providers: [SpacesService],
  controllers: [SpacesController],
})
export class SpacesModule {}

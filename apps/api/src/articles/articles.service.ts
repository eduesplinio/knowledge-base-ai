import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: string) {
    const article = new this.articleModel({
      ...createArticleDto,
      authorId: userId,
      content_vector: null,
    });
    return await article.save();
  }

  async findAll(spaceId?: string) {
    const filter = spaceId ? { spaceId } : {};
    return await this.articleModel.find(filter).exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`ID ${id} inválido`);
    }
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Artigo com ID ${id} não encontrado`);
    }
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`ID ${id} inválido`);
    }
    const article = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
    if (!article) {
      throw new NotFoundException(`Artigo com ID ${id} não encontrado`);
    }
    return article;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`ID ${id} inválido`);
    }
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Artigo com ID ${id} não encontrado`);
    }
    return result;
  }
}

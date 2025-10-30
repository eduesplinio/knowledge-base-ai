import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GenerateContentDto } from './dto/generate-content.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private readonly aiService: AiService,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: string) {
    let embedding: number[] | null = null;

    try {
      this.logger.log(
        `Gerando embedding para novo artigo: ${createArticleDto.title}`,
      );
      embedding = await this.aiService.generateEmbedding(
        createArticleDto.content,
      );

      if (embedding) {
        this.logger.log(
          `Embedding gerado com sucesso (${embedding.length} dimensões)`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Erro ao gerar embedding: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Artigo será salvo sem embedding.`,
      );
    }

    const article = new this.articleModel({
      ...createArticleDto,
      authorId: userId,
      content_vector: embedding,
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

    let embedding: number[] | null | undefined = undefined;

    if (updateArticleDto.content) {
      try {
        this.logger.log(`Regenerando embedding para artigo: ${id}`);
        embedding = await this.aiService.generateEmbedding(
          updateArticleDto.content,
        );

        if (embedding) {
          this.logger.log(
            `Embedding regenerado com sucesso (${embedding.length} dimensões)`,
          );
        }
      } catch (error) {
        this.logger.warn(
          `Erro ao regenerar embedding: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Artigo será atualizado sem embedding.`,
        );
      }
    }

    const updateData =
      embedding !== undefined
        ? { ...updateArticleDto, content_vector: embedding }
        : updateArticleDto;

    const article = await this.articleModel
      .findByIdAndUpdate(id, updateData, { new: true })
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

  async generateContent(generateContentDto: GenerateContentDto) {
    const response = await this.aiService.generateContent({
      prompt: generateContentDto.prompt,
      temperature: generateContentDto.temperature,
      maxTokens: generateContentDto.maxTokens,
    });

    return {
      content: response.content,
      tokensUsed: response.tokensUsed,
    };
  }
}

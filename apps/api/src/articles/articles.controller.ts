import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GenerateContentDto } from './dto/generate-content.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import { UploadArticleDto } from './dto/upload-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo artigo' })
  @ApiResponse({ status: 201, description: 'Artigo criado com sucesso' })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto, 'temp-user-id');
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os artigos' })
  @ApiQuery({
    name: 'spaceId',
    required: false,
    description: 'Filtrar artigos por espaço',
  })
  @ApiResponse({ status: 200, description: 'Lista de artigos' })
  findAll(@Query('spaceId') spaceId?: string) {
    return this.articlesService.findAll(spaceId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar artigos por similaridade semântica' })
  @ApiQuery({ name: 'q', description: 'Query de busca' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limite de resultados',
  })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  async search(@Query('q') query: string, @Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return this.articlesService.searchArticles(query, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar artigo por ID' })
  @ApiResponse({ status: 200, description: 'Artigo encontrado' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar artigo' })
  @ApiResponse({ status: 200, description: 'Artigo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar artigo' })
  @ApiResponse({ status: 200, description: 'Artigo deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Gerar conteúdo com IA' })
  @ApiResponse({ status: 201, description: 'Conteúdo gerado com sucesso' })
  async generateContent(@Body() generateContentDto: GenerateContentDto) {
    return this.articlesService.generateContent(generateContentDto);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Fazer upload de arquivo .md ou .txt como artigo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo .md ou .txt',
        },
        spaceId: {
          type: 'string',
          description: 'ID do espaço',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags do artigo',
        },
      },
      required: ['file', 'spaceId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Artigo criado a partir do arquivo',
  })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou não enviado' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadArticle(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadArticleDto,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    try {
      const content = await fs.readFile(file.path, 'utf-8');

      const article = await this.articlesService.createFromFile(
        content,
        file.originalname,
        uploadDto.spaceId,
        'temp-user-id',
        uploadDto.tags,
      );
      await fs.unlink(file.path);

      return article;
    } catch (error) {
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {});
      }
      throw error;
    }
  }
}

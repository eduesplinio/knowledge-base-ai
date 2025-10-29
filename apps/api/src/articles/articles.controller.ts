import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GenerateContentDto } from './dto/generate-content.dto';

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
}

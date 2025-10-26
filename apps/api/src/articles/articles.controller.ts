import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('articles')
@ApiBearerAuth()
@Controller('articles')
@UseGuards(AuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo artigo' })
  @ApiResponse({ status: 201, description: 'Artigo criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.articlesService.create(createArticleDto, req.user.userId);
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
}

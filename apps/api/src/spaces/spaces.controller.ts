import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('spaces')
@ApiBearerAuth()
@Controller('spaces')
@UseGuards(AuthGuard)
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo space' })
  @ApiResponse({ status: 201, description: 'Space criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  create(
    @Body() createSpaceDto: CreateSpaceDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.spacesService.create(createSpaceDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os spaces' })
  @ApiResponse({ status: 200, description: 'Lista de spaces' })
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar space por ID' })
  @ApiResponse({ status: 200, description: 'Space encontrado' })
  @ApiResponse({ status: 404, description: 'Space não encontrado' })
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar space' })
  @ApiResponse({ status: 200, description: 'Space atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Space não encontrado' })
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar space' })
  @ApiResponse({ status: 200, description: 'Space deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Space não encontrado' })
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}

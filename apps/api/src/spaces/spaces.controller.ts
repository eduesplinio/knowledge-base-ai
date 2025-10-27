import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo space' })
  @ApiResponse({ status: 201, description: 'Space criado com sucesso' })
  create(@Body() createSpaceDto: CreateSpaceDto) {
    // TODO: Get user ID from session when needed
    return this.spacesService.create(createSpaceDto, 'temp-user-id');
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

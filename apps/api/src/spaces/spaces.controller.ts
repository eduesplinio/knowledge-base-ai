import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Criar novo espaço' })
  @ApiResponse({ status: 201, description: 'Espaço criado com sucesso' })
  @ApiSecurity('x-user-id')
  create(
    @Body() createSpaceDto: CreateSpaceDto,
    @Request() req: { userId: string },
  ) {
    return this.spacesService.create(createSpaceDto, req.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os espaços' })
  @ApiResponse({ status: 200, description: 'Lista de espaços' })
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar espaço por ID' })
  @ApiResponse({ status: 200, description: 'Espaço encontrado' })
  @ApiResponse({ status: 404, description: 'Espaço não encontrado' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.spacesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar espaço' })
  @ApiResponse({ status: 200, description: 'Espaço atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Espaço não encontrado' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar espaço' })
  @ApiResponse({ status: 200, description: 'Espaço deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Espaço não encontrado' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.spacesService.remove(id);
  }
}

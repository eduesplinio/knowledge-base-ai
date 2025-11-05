import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SyncUserDto } from './dto/sync-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sincronizar usuário do NextAuth com backend' })
  @ApiResponse({ status: 201, description: 'Usuário sincronizado' })
  sync(@Body() syncUserDto: SyncUserDto) {
    return this.usersService.sync(syncUserDto);
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Info - Retorna informações sobre a API' })
  @ApiResponse({ status: 200, description: 'Informações da API' })
  getInfo() {
    return {
      name: 'Knowledge Base AI API',
      version: '1.0.0',
      description: 'API para Base de Conhecimento com IA',
      documentation: '/api/help',
      endpoints: {
        spaces: '/spaces',
        articles: '/articles',
        search: '/articles/search',
        generate: '/articles/generate',
        upload: '/articles/upload',
      },
      features: [
        'CRUD de Spaces e Articles',
        'Geração de conteúdo com IA (OpenAI GPT-4)',
        'Busca semântica vetorial (MongoDB Vector Search)',
        'Upload de documentos (.md, .txt)',
        'Embeddings automáticos',
      ],
      status: 'online',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health Check - Verifica se a API está funcionando',
  })
  @ApiResponse({ status: 200, description: 'API está saudável' })
  healthCheck() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

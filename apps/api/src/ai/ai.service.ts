import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  GenerationRequest,
  GenerationResponse,
} from './interfaces/generation.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY não configurada. Funcionalidades de IA estarão desabilitadas.',
      );
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateContent(
    request: GenerationRequest,
  ): Promise<GenerationResponse> {
    try {
      this.logger.log(
        `Gerando conteúdo para prompt: ${request.prompt.substring(0, 50)}...`,
      );

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente especializado em criar artigos técnicos e documentação clara.',
          },
          {
            role: 'user',
            content: request.prompt,
          },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2000,
      });

      const content = completion.choices[0]?.message?.content ?? '';
      const tokensUsed = completion.usage?.total_tokens;

      this.logger.log(
        `Conteúdo gerado com sucesso. Tokens usados: ${tokensUsed}`,
      );

      return {
        content,
        tokensUsed,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Erro ao gerar conteúdo: ${errorMessage}`, errorStack);
      throw new Error(`Erro ao gerar conteúdo: ${errorMessage}`);
    }
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    try {
      this.logger.log(
        `Gerando embedding para texto de ${text.length} caracteres`,
      );

      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      const embedding = response.data[0]?.embedding;

      if (!embedding) {
        this.logger.warn('Embedding não foi gerado pela API');
        return null;
      }

      this.logger.log(
        `Embedding gerado com sucesso. Dimensões: ${embedding.length}`,
      );

      return embedding;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Erro ao gerar embedding: ${errorMessage}`, errorStack);
      return null;
    }
  }
}

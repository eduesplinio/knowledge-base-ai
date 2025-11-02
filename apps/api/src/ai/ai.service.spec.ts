import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'OPENAI_API_KEY') {
                return 'test-api-key';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  describe('generateEmbedding', () => {
    it('should generate embedding successfully', async () => {
      const fakeEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];
      const mockEmbedding = jest
        .spyOn(service['openai'].embeddings, 'create')
        .mockResolvedValue({
          data: [{ embedding: fakeEmbedding }],
        } as any);

      const result = await service.generateEmbedding('texto de teste');

      expect(result).toEqual(fakeEmbedding);
      expect(mockEmbedding).toHaveBeenCalledWith({
        model: 'text-embedding-3-small',
        input: 'texto de teste',
      });
    });

    it('should return null when embedding fails', async () => {
      jest
        .spyOn(service['openai'].embeddings, 'create')
        .mockRejectedValue(new Error('API Error'));

      const result = await service.generateEmbedding('test');

      expect(result).toBeNull();
    });
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      const fakeResponse = {
        choices: [{ message: { content: 'Generated content' } }],
        usage: { total_tokens: 100 },
      };
      const mockChat = jest
        .spyOn(service['openai'].chat.completions, 'create')
        .mockResolvedValue(fakeResponse as any);

      const result = await service.generateContent({
        prompt: 'test prompt',
        temperature: 0.7,
        maxTokens: 1000,
      });

      expect(result).toEqual({
        content: 'Generated content',
        tokensUsed: 100,
      });
      expect(mockChat).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente especializado em criar artigos técnicos e documentação clara.',
          },
          {
            role: 'user',
            content: 'test prompt',
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
    });

    it('should throw error when content generation fails', async () => {
      jest
        .spyOn(service['openai'].chat.completions, 'create')
        .mockRejectedValue(new Error('OpenAI API Error'));

      await expect(
        service.generateContent({
          prompt: 'test prompt',
        }),
      ).rejects.toThrow('Erro ao gerar conteúdo: OpenAI API Error');
    });
  });
});

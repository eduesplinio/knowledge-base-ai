import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AiService } from '../ai/ai.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let articlesService: ArticlesService;
  let aiService: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: {
            generateContent: jest.fn(),
            create: jest.fn(),
            searchArticles: jest.fn(),
          },
        },
        {
          provide: AiService,
          useValue: {
            generateContent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    articlesService = module.get<ArticlesService>(ArticlesService);
    aiService = module.get<AiService>(AiService);
  });

  describe('POST /articles', () => {
    it('should create article with embedding successfully', async () => {
      const mockArticle = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Meu Artigo',
        content: 'Conteúdo do artigo',
        spaceId: 'space123',
        authorId: 'temp-user-id',
        content_vector: [0.1, 0.2, 0.3],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn(),
        toObject: jest.fn(),
      } as any;

      jest.spyOn(articlesService, 'create').mockResolvedValue(mockArticle);

      const dto = {
        title: 'Meu Artigo',
        content: 'Conteúdo do artigo',
        spaceId: 'space123',
      };

      const result = await controller.create(dto);

      expect(result).toEqual(mockArticle);
      expect(articlesService.create).toHaveBeenCalledWith(dto, 'temp-user-id');
    });
  });

  describe('POST /articles/generate', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        content: 'Conteúdo gerado pela IA',
        tokensUsed: 150,
      };

      jest
        .spyOn(articlesService, 'generateContent')
        .mockResolvedValue(mockResponse);

      const dto = {
        prompt: 'Escreva sobre JavaScript',
        temperature: 0.7,
      };

      const result = await controller.generateContent(dto);

      expect(result).toEqual(mockResponse);
      expect(articlesService.generateContent).toHaveBeenCalledWith(dto);
    });
  });

  describe('GET /articles/search', () => {
    it('should search articles successfully', async () => {
      const mockSearchResults = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'JavaScript Básico',
          content: 'Introdução ao JavaScript...',
          score: 0.95,
        },
      ];

      jest
        .spyOn(articlesService, 'searchArticles')
        .mockResolvedValue(mockSearchResults);

      const result = await controller.search('JavaScript', '10');

      expect(result).toEqual(mockSearchResults);
      expect(articlesService.searchArticles).toHaveBeenCalledWith(
        'JavaScript',
        10,
      );
    });
  });
});

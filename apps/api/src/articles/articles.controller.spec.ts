import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AiService } from '../ai/ai.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let articlesService: ArticlesService;

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
  });

  describe('POST /articles', () => {
    it('should create article with embedding successfully', async () => {
      const mockArticle = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Meu Artigo',
        content: 'Conteúdo do artigo',
        spaceId: 'space123',
        authorId: 'user123',
        content_vector: [0.1, 0.2, 0.3],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn(),
        toObject: jest.fn(),
      } as never;

      const mockCreate = jest
        .spyOn(articlesService, 'create')
        .mockResolvedValue(mockArticle);

      const dto = {
        title: 'Meu Artigo',
        content: 'Conteúdo do artigo',
        spaceId: 'space123',
      };

      const mockReq = { userId: 'user123' };

      const result = await controller.create(dto, mockReq);

      expect(result).toEqual(mockArticle);
      expect(mockCreate).toHaveBeenCalledWith(dto, 'user123');
    });
  });

  describe('POST /articles/generate', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        content: 'Conteúdo gerado pela IA',
        tokensUsed: 150,
      };

      const mockGenerate = jest
        .spyOn(articlesService, 'generateContent')
        .mockResolvedValue(mockResponse);

      const dto = {
        prompt: 'Escreva sobre JavaScript',
        temperature: 0.7,
      };

      const result = await controller.generateContent(dto);

      expect(result).toEqual(mockResponse);
      expect(mockGenerate).toHaveBeenCalledWith(dto);
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

      const mockSearch = jest
        .spyOn(articlesService, 'searchArticles')
        .mockResolvedValue(mockSearchResults);

      const result = await controller.search('JavaScript', '10');

      expect(result).toEqual(mockSearchResults);
      expect(mockSearch).toHaveBeenCalledWith('JavaScript', 10);
    });
  });
});

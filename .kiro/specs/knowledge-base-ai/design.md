# Design Document

## Overview

Este documento detalha a arquitetura técnica da Base de Conhecimento com IA. O sistema é construído como um monorepo usando pnpm, com separação clara entre frontend (Next.js) e backend (NestJS), comunicando-se via API REST.

### Tecnologias Principais

- **Monorepo**: pnpm workspaces
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, shadcn/ui, TailwindCSS
- **Backend**: NestJS, TypeScript, Mongoose
- **Database**: MongoDB Atlas (com Vector Search)
- **Autenticação**: NextAuth.js
- **IA**: OpenAI API (GPT-4 para geração, text-embedding-3-small para embeddings)
- **Qualidade**: ESLint, Prettier, Husky, Commitlint, Jest
- **CI/CD**: GitHub Actions

### Princípios de Design

1. **Separação de Responsabilidades**: Frontend e backend completamente desacoplados
2. **Type Safety**: TypeScript strict mode em todo o projeto
3. **Clean Architecture**: Camadas bem definidas (Controllers, Services, Repositories)
4. **API First**: Backend expõe API REST documentada
5. **Responsive Design**: Mobile-first usando TailwindCSS
6. **Error Handling**: Tratamento consistente de erros em todas as camadas

## Architecture

### Monorepo Structure

```
knowledge-base-ai/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # Utilities, API client
│   │   │   └── types/         # TypeScript types
│   │   ├── public/
│   │   └── package.json
│   │
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── modules/       # Feature modules
│       │   ├── common/        # Shared code (guards, decorators)
│       │   ├── config/        # Configuration
│       │   └── main.ts
│       ├── test/
│       └── package.json
│
├── packages/                   # Shared packages (opcional)
│   └── types/                 # Shared TypeScript types
│
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions
│
├── .husky/                    # Git hooks
├── package.json               # Root package.json
├── pnpm-workspace.yaml
├── turbo.json                 # Turborepo config (opcional)
└── README.md
```


### System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend - Next.js"
        UI[UI Components<br/>shadcn/ui]
        Pages[Pages<br/>App Router]
        Auth[NextAuth<br/>Session Management]
        APIClient[API Client<br/>fetch/axios]
    end

    subgraph "Backend - NestJS"
        Controllers[Controllers<br/>REST Endpoints]
        Guards[Guards<br/>Auth & Permissions]
        Services[Services<br/>Business Logic]
        Repositories[Repositories<br/>Data Access]
    end

    subgraph "External Services"
        MongoDB[(MongoDB Atlas<br/>+ Vector Search)]
        OpenAI[OpenAI API<br/>GPT-4 + Embeddings]
    end

    UI --> Pages
    Pages --> Auth
    Pages --> APIClient
    APIClient --> Controllers
    Controllers --> Guards
    Guards --> Services
    Services --> Repositories
    Services --> OpenAI
    Repositories --> MongoDB
```

### Data Flow Examples

**1. Criar Artigo com IA:**
```
User Input (prompt) 
  → Frontend (editor) 
  → API POST /articles/generate 
  → OpenAI API (GPT-4) 
  → Generated Content 
  → Frontend (display)
```

**2. Salvar Artigo com Embedding:**
```
User saves article 
  → API POST /articles 
  → Generate embedding (OpenAI) 
  → Save to MongoDB (article + vector) 
  → Return success
```

**3. Busca Vetorial:**
```
User search query 
  → API GET /articles/search?q=... 
  → Generate query embedding 
  → MongoDB $vectorSearch 
  → Return ranked results
```

## Components and Interfaces

### Backend (NestJS) - Module Structure



#### 1. Auth Module
```typescript
// Responsável por autenticação e autorização
auth/
├── auth.controller.ts      // Endpoints de login/logout
├── auth.service.ts         // Lógica de autenticação
├── auth.guard.ts           // Guard de autenticação JWT
├── dto/
│   ├── login.dto.ts
│   └── register.dto.ts
└── strategies/
    └── jwt.strategy.ts     // Estratégia JWT
```

**Principais Endpoints:**
- `POST /auth/login` - Login com credentials
- `POST /auth/register` - Registro de novo usuário
- `GET /auth/me` - Dados do usuário autenticado
- `POST /auth/logout` - Logout

#### 2. Users Module
```typescript
users/
├── users.controller.ts
├── users.service.ts
├── users.repository.ts
├── schemas/
│   └── user.schema.ts      // Mongoose Schema
└── dto/
    ├── create-user.dto.ts
    └── update-user.dto.ts
```

#### 3. Spaces Module
```typescript
spaces/
├── spaces.controller.ts
├── spaces.service.ts
├── spaces.repository.ts
├── schemas/
│   └── space.schema.ts
└── dto/
    ├── create-space.dto.ts
    └── update-space.dto.ts
```

**Principais Endpoints:**
- `GET /spaces` - Listar todos os spaces
- `POST /spaces` - Criar novo space
- `GET /spaces/:id` - Detalhes de um space
- `PATCH /spaces/:id` - Atualizar space
- `DELETE /spaces/:id` - Deletar space

#### 4. Articles Module
```typescript
articles/
├── articles.controller.ts
├── articles.service.ts
├── articles.repository.ts
├── schemas/
│   └── article.schema.ts
└── dto/
    ├── create-article.dto.ts
    ├── update-article.dto.ts
    └── generate-content.dto.ts
```

**Principais Endpoints:**
- `GET /articles` - Listar artigos (com filtro por spaceId)
- `POST /articles` - Criar artigo
- `POST /articles/generate` - Gerar conteúdo com IA
- `GET /articles/search` - Busca vetorial semântica
- `GET /articles/:id` - Detalhes de um artigo
- `PATCH /articles/:id` - Atualizar artigo
- `DELETE /articles/:id` - Deletar artigo
- `POST /articles/upload` - Upload de arquivo .md/.txt

#### 5. AI Module
```typescript
ai/
├── ai.service.ts           // Integração com OpenAI
├── ai.module.ts
└── interfaces/
    ├── generation.interface.ts
    └── embedding.interface.ts
```

**Responsabilidades:**
- Gerar conteúdo usando GPT-4
- Gerar embeddings usando text-embedding-3-small
- Gerenciar rate limits e erros da API OpenAI

#### 6. Permissions Module (Etapa 3)
```typescript
permissions/
├── permissions.controller.ts
├── permissions.service.ts
├── permissions.guard.ts     // Guard de permissões
├── decorators/
│   └── require-permission.decorator.ts
└── schemas/
    └── permission.schema.ts
```



### Frontend (Next.js) - Page Structure

```typescript
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx        // Página de login
│   └── register/
│       └── page.tsx        // Página de registro
│
├── (dashboard)/
│   ├── layout.tsx          // Layout com navbar/sidebar
│   ├── page.tsx            // Dashboard principal (lista de spaces)
│   │
│   ├── spaces/
│   │   ├── [id]/
│   │   │   ├── page.tsx    // Detalhes do space + lista de artigos
│   │   │   └── settings/
│   │   │       └── page.tsx // Configurações do space
│   │   └── new/
│   │       └── page.tsx    // Criar novo space
│   │
│   ├── articles/
│   │   ├── [id]/
│   │   │   ├── page.tsx    // Visualizar artigo
│   │   │   ├── edit/
│   │   │   │   └── page.tsx // Editar artigo
│   │   │   └── history/
│   │   │       └── page.tsx // Histórico de versões
│   │   └── new/
│   │       └── page.tsx    // Criar novo artigo
│   │
│   └── search/
│       └── page.tsx        // Página de busca global
│
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts    // NextAuth configuration
│
└── layout.tsx              // Root layout
```

### Key Components (shadcn/ui based)

```typescript
components/
├── ui/                     // shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   └── ...
│
├── spaces/
│   ├── space-card.tsx      // Card para exibir space
│   ├── space-form.tsx      // Formulário criar/editar space
│   └── space-list.tsx      // Lista de spaces
│
├── articles/
│   ├── article-card.tsx    // Card para exibir artigo
│   ├── article-editor.tsx  // Editor de artigo com IA
│   ├── article-viewer.tsx  // Visualizador de artigo
│   ├── ai-generator.tsx    // Componente de geração com IA
│   └── article-list.tsx    // Lista de artigos
│
├── search/
│   ├── search-bar.tsx      // Barra de busca global
│   └── search-results.tsx  // Resultados da busca
│
└── layout/
    ├── navbar.tsx          // Barra de navegação
    ├── sidebar.tsx         // Menu lateral
    └── user-menu.tsx       // Menu do usuário
```

## Data Models

### MongoDB Schemas



#### User Schema
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,              // Único
  password: string,           // Hash bcrypt
  avatar?: string,            // URL da imagem
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - email (unique)
```

#### Space Schema
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  authorId: ObjectId,         // Ref: User
  settings?: {
    primaryColor?: string,    // Etapa 4 - Personalização
    logo?: string             // Etapa 4 - Personalização
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - authorId
```

#### Article Schema
```typescript
{
  _id: ObjectId,
  title: string,
  content: string,            // Markdown ou texto
  spaceId: ObjectId,          // Ref: Space
  authorId: ObjectId,         // Ref: User
  tags: string[],             // Array de tags
  content_vector: number[],   // Embedding (1536 dimensions para text-embedding-3-small)
  status?: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED',  // Etapa 4
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - spaceId
// - authorId
// - tags
// - content_vector (Vector Search Index no Atlas)
```

**Vector Search Index Configuration (MongoDB Atlas):**
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "content_vector",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

#### Permission Schema (Etapa 3)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Ref: User
  spaceId: ObjectId,          // Ref: Space
  role: 'VIEWER' | 'EDITOR' | 'ADMIN' | 'OWNER',
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - userId + spaceId (compound, unique)
// - spaceId
```

**Permission Levels:**
- **VIEWER**: Pode apenas visualizar artigos publicados
- **EDITOR**: Pode criar e editar artigos
- **ADMIN**: Pode gerenciar permissões de outros usuários
- **OWNER**: Criador do space, controle total

#### ArticleVersion Schema (Etapa 3)
```typescript
{
  _id: ObjectId,
  articleId: ObjectId,        // Ref: Article
  content: string,            // Conteúdo da versão anterior
  authorId: ObjectId,         // Quem fez a edição
  comment?: string,           // Etapa 4 - Comentário da edição
  createdAt: Date             // Timestamp da versão
}

// Indexes:
// - articleId + createdAt (compound)
```

#### Webhook Schema (Etapa 4 - Bônus)
```typescript
{
  _id: ObjectId,
  spaceId: ObjectId,          // Ref: Space
  url: string,                // URL do webhook
  events: string[],           // ['article.published', 'article.updated']
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - spaceId
```



## Authentication Flow

### NextAuth Configuration

```typescript
// apps/web/src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Chamar API do NestJS para validar credenciais
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        
        const user = await res.json();
        
        if (res.ok && user) {
          return user;
        }
        return null;
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Backend JWT Strategy

```typescript
// apps/api/src/auth/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### Protected Routes (Frontend)

```typescript
// apps/web/src/middleware.ts

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/spaces/:path*', '/articles/:path*', '/search'],
};
```

### Protected Endpoints (Backend)

```typescript
// apps/api/src/common/guards/auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      return false;
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch {
      return false;
    }
    
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```



## AI Integration

### OpenAI Service Design

```typescript
// apps/api/src/ai/ai.service.ts

import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Gera conteúdo usando GPT-4
   * @param prompt - Prompt do usuário
   * @returns Conteúdo gerado
   */
  async generateContent(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em criar artigos técnicos e documentação clara.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erro ao gerar conteúdo: ${error.message}`);
    }
  }

  /**
   * Gera embedding vetorial do texto
   * @param text - Texto para gerar embedding
   * @returns Array de números (vetor de 1536 dimensões)
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      // Log error mas não bloqueia a criação do artigo
      console.error('Erro ao gerar embedding:', error);
      return null;
    }
  }
}
```

### Vector Search Implementation

```typescript
// apps/api/src/articles/articles.service.ts

async searchArticles(query: string, limit: number = 10) {
  // 1. Gerar embedding da query
  const queryEmbedding = await this.aiService.generateEmbedding(query);
  
  if (!queryEmbedding) {
    throw new Error('Não foi possível gerar embedding da busca');
  }

  // 2. Executar busca vetorial no MongoDB
  const results = await this.articleModel.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index',           // Nome do índice no Atlas
        path: 'content_vector',
        queryVector: queryEmbedding,
        numCandidates: 100,              // Candidatos para considerar
        limit: limit,                    // Resultados finais
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        spaceId: 1,
        authorId: 1,
        tags: 1,
        createdAt: 1,
        score: { $meta: 'vectorSearchScore' },  // Score de similaridade
      },
    },
  ]);

  return results;
}
```

### Article Creation with Embedding

```typescript
// apps/api/src/articles/articles.service.ts

async createArticle(createArticleDto: CreateArticleDto, userId: string) {
  // 1. Gerar embedding do conteúdo
  const embedding = await this.aiService.generateEmbedding(
    createArticleDto.content
  );

  // 2. Criar artigo com embedding
  const article = new this.articleModel({
    ...createArticleDto,
    authorId: userId,
    content_vector: embedding,
  });

  // 3. Salvar no MongoDB
  return await article.save();
}

async updateArticle(id: string, updateArticleDto: UpdateArticleDto) {
  // 1. Se o conteúdo mudou, regenerar embedding
  let embedding = undefined;
  if (updateArticleDto.content) {
    embedding = await this.aiService.generateEmbedding(
      updateArticleDto.content
    );
  }

  // 2. Atualizar artigo
  return await this.articleModel.findByIdAndUpdate(
    id,
    {
      ...updateArticleDto,
      ...(embedding && { content_vector: embedding }),
    },
    { new: true }
  );
}
```



## Error Handling

### Backend Error Strategy

```typescript
// apps/api/src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

### Frontend Error Handling

```typescript
// apps/web/src/lib/api-client.ts

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(response.status, error.message, error);
  }

  return response.json();
}
```

## Testing Strategy

### Backend Testing (Jest + NestJS)

```typescript
// apps/api/src/articles/articles.service.spec.ts

describe('ArticlesService', () => {
  let service: ArticlesService;
  let aiService: AIService;
  let model: Model<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: AIService,
          useValue: {
            generateEmbedding: jest.fn(),
            generateContent: jest.fn(),
          },
        },
        {
          provide: getModelToken(Article.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    aiService = module.get<AIService>(AIService);
  });

  describe('createArticle', () => {
    it('should create article with embedding', async () => {
      const mockEmbedding = new Array(1536).fill(0.1);
      jest.spyOn(aiService, 'generateEmbedding').mockResolvedValue(mockEmbedding);

      const dto = {
        title: 'Test Article',
        content: 'Test content',
        spaceId: 'space123',
        tags: ['test'],
      };

      const result = await service.createArticle(dto, 'user123');

      expect(aiService.generateEmbedding).toHaveBeenCalledWith(dto.content);
      expect(result.content_vector).toEqual(mockEmbedding);
    });
  });
});
```

### Integration Tests

```typescript
// apps/api/test/articles.e2e-spec.ts

describe('Articles (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login para obter token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = loginResponse.body.access_token;
  });

  it('/articles (POST) should create article', () => {
    return request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Article',
        content: 'Test content',
        spaceId: 'space123',
        tags: ['test'],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Article');
      });
  });
});
```

### Frontend Testing (Jest + React Testing Library)

```typescript
// apps/web/src/components/articles/article-card.test.tsx

import { render, screen } from '@testing-library/react';
import { ArticleCard } from './article-card';

describe('ArticleCard', () => {
  const mockArticle = {
    _id: '1',
    title: 'Test Article',
    content: 'Test content',
    authorId: 'user1',
    spaceId: 'space1',
    tags: ['test'],
    createdAt: new Date(),
  };

  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('renders article tags', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```



## Environment Variables

### Backend (.env)

```bash
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/knowledge-base?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-...

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production

# GitHub OAuth (opcional)
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
```

### .env.example Files

Criar arquivos `.env.example` em ambos apps com as mesmas variáveis mas sem valores sensíveis:

```bash
# apps/api/.env.example
NODE_ENV=development
PORT=3001
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
CORS_ORIGIN=http://localhost:3000
```

```bash
# apps/web/.env.example
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```

## CI/CD Configuration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run ESLint
        run: pnpm lint:check
      
      - name: Run Prettier
        run: pnpm format:check

  test-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run API tests
        run: pnpm --filter api test
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI_TEST }}
          JWT_SECRET: test-secret

  test-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run Web tests
        run: pnpm --filter web test

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-format, test-api, test-web]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build API
        run: pnpm --filter api build
      
      - name: Build Web
        run: pnpm --filter web build
```



## Code Quality Configuration

### ESLint Configuration

```json
// .eslintrc.json (root)
{
  "root": true,
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "es2022": true
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### Commitlint Configuration

```json
// .commitlintrc.json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "build",
        "revert"
      ]
    ]
  }
}
```

### Husky Hooks

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint --edit $1
```

### Lint-staged Configuration

```json
// package.json (root)
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

## TypeScript Configuration

### Root tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### API tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### Web tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```



## Package.json Scripts

### Root package.json

```json
{
  "name": "knowledge-base-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter web --filter api dev",
    "build": "pnpm --filter api build && pnpm --filter web build",
    "test": "pnpm --recursive test",
    "test:watch": "pnpm --recursive test:watch",
    "test:coverage": "pnpm --recursive test:coverage",
    "lint:check": "pnpm --recursive lint:check",
    "lint:fix": "pnpm --recursive lint:fix",
    "format:check": "prettier --check .",
    "format:fix": "prettier --write .",
    "commit": "cz",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@commitlint/cli": "latest",
    "@commitlint/config-conventional": "latest",
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest",
    "commitizen": "latest",
    "cz-conventional-changelog": "latest",
    "eslint": "latest",
    "eslint-config-prettier": "latest",
    "husky": "latest",
    "lint-staged": "latest",
    "prettier": "latest",
    "typescript": "latest"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

### API package.json

```json
{
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint:check": "eslint \"{src,test}/**/*.ts\"",
    "lint:fix": "eslint \"{src,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "latest",
    "@nestjs/core": "latest",
    "@nestjs/jwt": "latest",
    "@nestjs/mongoose": "latest",
    "@nestjs/passport": "latest",
    "@nestjs/platform-express": "latest",
    "bcrypt": "latest",
    "class-transformer": "latest",
    "class-validator": "latest",
    "mongoose": "latest",
    "openai": "latest",
    "passport": "latest",
    "passport-jwt": "latest",
    "reflect-metadata": "latest",
    "rxjs": "latest"
  },
  "devDependencies": {
    "@nestjs/cli": "latest",
    "@nestjs/schematics": "latest",
    "@nestjs/testing": "latest",
    "@types/bcrypt": "latest",
    "@types/express": "latest",
    "@types/jest": "latest",
    "@types/node": "latest",
    "@types/passport-jwt": "latest",
    "jest": "latest",
    "ts-jest": "latest",
    "ts-loader": "latest",
    "ts-node": "latest",
    "tsconfig-paths": "latest"
  }
}
```

### Web package.json

```json
{
  "name": "web",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint:check": "next lint",
    "lint:fix": "next lint --fix"
  },
  "dependencies": {
    "next": "latest",
    "next-auth": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "lucide-react": "latest",
    "tailwind-merge": "latest",
    "tailwindcss-animate": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "jest": "latest",
    "jest-environment-jsdom": "latest",
    "postcss": "latest",
    "tailwindcss": "latest",
    "typescript": "latest"
  }
}
```

## MongoDB Atlas Setup Guide

### 1. Criar Cluster

1. Acessar [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Criar conta gratuita
3. Criar novo cluster (Free Tier - M0)
4. Escolher região mais próxima
5. Aguardar criação do cluster (~5 minutos)

### 2. Configurar Acesso

1. **Database Access**: Criar usuário com senha
2. **Network Access**: Adicionar IP (0.0.0.0/0 para desenvolvimento)
3. **Connect**: Copiar connection string

### 3. Criar Vector Search Index

1. Acessar cluster → Browse Collections
2. Criar database: `knowledge-base`
3. Criar collection: `articles`
4. Ir em "Search Indexes" → "Create Search Index"
5. Escolher "JSON Editor"
6. Colar configuração:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "content_vector",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

7. Nomear índice como: `vector_index`
8. Criar índice

### 4. Connection String

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/knowledge-base?retryWrites=true&w=majority
```

Substituir:
- `<username>`: Seu usuário
- `<password>`: Sua senha
- `cluster0.xxxxx`: Seu cluster ID

## Performance Considerations

### Backend Optimizations

1. **Database Indexes**: Criar índices para queries frequentes
2. **Caching**: Implementar cache Redis para dados frequentes (opcional)
3. **Pagination**: Implementar paginação em listagens
4. **Rate Limiting**: Limitar requisições por IP/usuário
5. **Compression**: Habilitar compressão gzip

### Frontend Optimizations

1. **Code Splitting**: Next.js faz automaticamente
2. **Image Optimization**: Usar componente `<Image>` do Next.js
3. **Lazy Loading**: Carregar componentes sob demanda
4. **Debouncing**: Debounce em campos de busca
5. **Optimistic Updates**: Atualizar UI antes da resposta da API

## Security Best Practices

1. **Environment Variables**: Nunca commitar .env
2. **Input Validation**: Validar todos os inputs com class-validator
3. **SQL Injection**: Mongoose previne automaticamente
4. **XSS**: React escapa automaticamente
5. **CORS**: Configurar apenas origens permitidas
6. **Rate Limiting**: Implementar throttling
7. **Helmet**: Usar helmet.js para headers de segurança
8. **HTTPS**: Usar HTTPS em produção
9. **JWT Expiration**: Tokens com tempo de expiração
10. **Password Hashing**: Bcrypt com salt rounds adequado

## Deployment Considerations

### Backend Deployment (Render/Railway/Heroku)

1. Build command: `pnpm --filter api build`
2. Start command: `pnpm --filter api start:prod`
3. Environment variables configuradas
4. Health check endpoint: `GET /health`

### Frontend Deployment (Vercel/Netlify)

1. Build command: `pnpm --filter web build`
2. Output directory: `apps/web/.next`
3. Environment variables configuradas
4. Automatic deployments on push

### Database

- MongoDB Atlas já está em cloud
- Backup automático habilitado
- Monitoring configurado


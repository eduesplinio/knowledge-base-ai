<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/material-symbols/menu-book.svg?color=%23ffffff&width=64&height=64">
    <source media="(prefers-color-scheme: light)" srcset="https://api.iconify.design/material-symbols/menu-book.svg?color=%2324292f&width=64&height=64">
    <img src="https://api.iconify.design/material-symbols/menu-book.svg?color=%2324292f&width=64&height=64" alt="Knowledge Base Icon" />
  </picture>
  <h1><a href="https://knowledge-base-ai-eosin.vercel.app/" target="_blank">Base de Conhecimento</a></h1>
  <p><strong>Plataforma de conhecimento interno potencializada por Inteligência Artificial</strong></p>
  
  <p>
    <a href="https://knowledge-base-ai-eosin.vercel.app/" target="_blank">
      <img alt="Demo" src="https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge&logo=vercel" />
    </a>
    <a href="https://api-production-43ba.up.railway.app/api/help" target="_blank">
      <img alt="API" src="https://img.shields.io/badge/API-Live-blue?style=for-the-badge&logo=railway" />
    </a>
  </p>
  
  <p>
    <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
  </p>
</div>

## Quick Start

```bash
# Clone e instale
git clone https://github.com/eduesplinio/knowledge-base-ai.git
cd knowledge-base-ai
pnpm install

# Configure .env (veja seção Configuração)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Execute
pnpm dev
```

**Acesse:** Frontend em http://localhost:3000 | API em http://localhost:3001

## Sobre o Projeto

Plataforma de **conhecimento interno** com IA para criar, organizar e pesquisar artigos de forma inteligente.

**Stack:** Next.js 15 + NestJS 11 + MongoDB + OpenAI + TypeScript

## Índice

- [Quick Start](#quick-start)
- [Features](#features)
- [Stack Tecnológica](#stack-tecnológica)
- [Configuração](#configuração)
- [Arquitetura](#arquitetura)
- [Testes](#testes)
- [Deploy](#deploy)
- [Suporte](#suporte)

## Features

| Categoria    | Features                                                     |
| ------------ | ------------------------------------------------------------ |
| **Auth**     | GitHub OAuth, JWT, Proteção de rotas                         |
| **Conteúdo** | CRUD Spaces/Articles, Editor Markdown, Upload arquivos, Tags |
| **IA**       | Geração GPT-4, Embeddings, Busca semântica vetorial          |
| **UI/UX**    | Responsivo, shadcn/ui, Loading states, Toasts, Sidebar       |
| **DevOps**   | TypeScript, ESLint/Prettier, Jest, Husky, Monorepo           |

## Stack Tecnológica

| Camada       | Tecnologias                                                          |
| ------------ | -------------------------------------------------------------------- |
| **Frontend** | Next.js 15, TypeScript, Tailwind, NextAuth.js, shadcn/ui             |
| **Backend**  | NestJS 11, MongoDB, Mongoose, OpenAI API, JWT, Swagger               |
| **DevOps**   | Turbo (monorepo), pnpm, ESLint/Prettier, Jest, Husky, GitHub Actions |

## Arquitetura

### Estrutura do Monorepo

```
knowledge-base-ai/
├── apps/
│   ├── web/          # Frontend Next.js 15
│   └── api/          # Backend NestJS 11
├── packages/
│   ├── ui/           # Componentes shadcn/ui compartilhados
│   ├── eslint-config/    # Configurações ESLint
│   └── typescript-config/ # Configurações TypeScript
└── .github/workflows/    # CI/CD GitHub Actions
```

### Arquitetura de Sistema

```
Frontend (Next.js)     API (NestJS)        Dados
├─ App Router              ├─ Articles Module    ├─ MongoDB Atlas
├─ Components (shadcn)     ├─ Spaces Module      ├─ Vector Search
├─ NextAuth.js             ├─ AI Service         └─ GitHub OAuth
└─ Tailwind CSS            └─ Swagger Docs
```

**Fluxo IA:** Prompt → GPT-4 → Embeddings → MongoDB → Busca Semântica

### Fluxo de Geração com IA

```mermaid
sequenceDiagram
    participant U as Usuário
    participant W as Web App
    participant A as API NestJS
    participant O as OpenAI
    participant M as MongoDB

    U->>+W: Criar Artigo com IA
    W->>+A: POST /articles/generate
    A->>+O: Gerar conteúdo GPT-4
    O-->>-A: Texto gerado
    A->>+O: Criar embedding
    O-->>-A: Vector 1536D
    A->>+M: Salvar artigo + vector
    M-->>-A: Artigo salvo
    A-->>-W: Artigo criado
    W-->>-U: Exibe resultado
```

## Configuração

### Pré-requisitos

- Node.js 20+, pnpm, MongoDB Atlas, GitHub OAuth, OpenAI API (opcional)

### Variáveis de Ambiente

**Backend (`apps/api/.env`):**

```bash
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
OPENAI_API_KEY=sk-...
CORS_ORIGIN=http://localhost:3000
```

**Frontend (`apps/web/.env.local`):**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>
GITHUB_ID=<github-oauth-client-id>
GITHUB_SECRET=<github-oauth-client-secret>
```

### MongoDB Atlas Setup

1. Criar cluster gratuito M0
2. Configurar usuário e IP access
3. Criar Vector Search Index:

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

### GitHub OAuth Setup

1. [GitHub Developer Settings](https://github.com/settings/developers) → New OAuth App
2. Homepage: `http://localhost:3000`
3. Callback: `http://localhost:3000/api/auth/callback/github`

## Deploy

| Serviço      | Plataforma    | Configuração                               |
| ------------ | ------------- | ------------------------------------------ |
| **Frontend** | Vercel        | Root: `apps/web`, Build: `pnpm build`      |
| **Backend**  | Railway       | Root: `apps/api`, Start: `pnpm start:prod` |
| **Database** | MongoDB Atlas | M0 Free Tier                               |

## Testes

### Executar Testes

```bash
# Todos os testes
pnpm test

# Por aplicação
pnpm --filter api test    # Backend (NestJS + Jest)
pnpm --filter web test    # Frontend (React + Jest)

# Com cobertura
pnpm test:coverage

# Modo watch
pnpm test:watch
```

### Estrutura de Testes

| Módulo           | Tipo     | Status                  |
| ---------------- | -------- | ----------------------- |
| **Articles API** | E2E      | Configurado (básico)    |
| **Components**   | Unitário | Testes básicos de UI    |
| **CI/CD**        | Pipeline | ESLint, Prettier, Build |

## Suporte

**Links:**

- [Demo Live](https://knowledge-base-ai-eosin.vercel.app/)
- [API Docs](https://api-production-43ba.up.railway.app/api/help)
- [Repositório](https://github.com/eduesplinio/knowledge-base-ai)

**Recursos:**

- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)

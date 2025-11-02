<div align="center">
  <h1>🧠 <a href="https://knowledge-base-ai-eosin.vercel.app/" target="_blank">Knowledge Base AI</a></h1>
  <p><strong>Base de Conhecimento interna potencializada por IA</strong></p>
  
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

## 📋 Sobre o Projeto

O **[Knowledge Base AI](https://knowledge-base-ai-eosin.vercel.app/)** é uma plataforma moderna para gerenciamento de conhecimento interno, potencializada por Inteligência Artificial. Permite criar, organizar e pesquisar artigos de forma inteligente, com geração automática de conteúdo via OpenAI e busca semântica avançada.

### 🎯 Objetivo

Este projeto foi desenvolvido como parte de um desafio técnico para demonstrar habilidades em:

- Desenvolvimento full-stack com TypeScript
- Integração com APIs de IA (OpenAI)
- Implementação de busca vetorial semântica
- Arquitetura de monorepo escalável

## ✨ Features Implementadas

### 🔐 Autenticação e Segurança

- [x] Login via GitHub OAuth (NextAuth.js)
- [x] Sessões JWT seguras
- [x] Proteção de rotas no frontend e backend
- [x] CORS configurado para produção

### � Gerenciamfento de Conteúdo

- [x] CRUD completo de Spaces (categorias)
- [x] CRUD completo de Articles (artigos)
- [x] Editor Markdown com preview em tempo real
- [x] Upload de arquivos (.md, .txt)
- [x] Sistema de tags para classificação
- [x] Organização hierárquica (Spaces → Articles)

### 🤖 Inteligência Artificial

- [x] Geração automática de conteúdo via GPT-4
- [x] Geração automática de embeddings (text-embedding-3-small)
- [x] Busca semântica vetorial com MongoDB Atlas
- [x] Sugestões inteligentes baseadas em contexto

### 🎨 Interface e UX

- [x] Design responsivo (mobile, tablet, desktop)
- [x] Componentes reutilizáveis com shadcn/ui
- [x] Loading states e feedback visual
- [x] Toasts para notificações
- [x] Estados vazios amigáveis
- [x] Navegação com sidebar e breadcrumbs
- [x] Ícones contextuais (react-icons)

### 🧪 Qualidade e DevOps

- [x] TypeScript strict mode
- [x] ESLint + Prettier configurados
- [x] Husky + Commitlint (commits semânticos)
- [x] Testes unitários e de integração (Jest)
- [x] CI/CD com GitHub Actions
- [x] Deploy automatizado (Vercel + Railway)
- [x] Monorepo com Turbo

## 🏗️ Arquitetura do Projeto

### 📁 Estrutura do Repositório

```
kb-ia/
├── apps/
│   ├── api/                 # Backend NestJS
│   │   ├── src/
│   │   │   ├── articles/    # Módulo de artigos
│   │   │   ├── spaces/      # Módulo de spaces
│   │   │   ├── ai/          # Serviços de IA
│   │   │   └── common/      # Utilitários compartilhados
│   │   └── test/            # Testes E2E
│   └── web/                 # Frontend Next.js
│       ├── app/             # App Router
│       ├── components/      # Componentes React
│       ├── lib/             # Utilitários (auth, etc)
│       └── styles/          # Estilos globais
├── packages/
│   ├── ui/                  # Design System
│   ├── eslint-config/       # Configuração ESLint
│   └── typescript-config/   # Configuração TypeScript
├── .github/workflows/       # CI/CD
└── turbo.json              # Configuração Turbo
```

### 🤖 Fluxo de Geração de Conteúdo IA

```mermaid
flowchart TD
    A[Usuário insere prompt] --> B[Frontend valida entrada]
    B --> C[Envia para API /articles/generate]
    C --> D[AIService processa prompt]
    D --> E[Chama OpenAI GPT-4]
    E --> F[Gera conteúdo estruturado]
    F --> G[Cria embeddings para busca]
    G --> H[Salva artigo no MongoDB]
    H --> I[Retorna artigo criado]
    I --> J[Frontend exibe resultado]
```

### 🔍 Fluxo de Busca Semântica

```mermaid
flowchart LR
    A[Query do usuário] --> B[Gera embedding da query]
    B --> C[Busca vetorial no MongoDB]
    C --> D[Calcula similaridade]
    D --> E[Ordena por relevância]
    E --> F[Retorna resultados]
    F --> G[Exibe no frontend]
```

### 🏛️ Arquitetura de Sistema

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        UI[Interface do Usuário]
        AUTH[NextAuth.js]
        COMP[Componentes React]
    end

    subgraph "Backend (NestJS)"
        API[REST API]
        ARTICLES[Articles Module]
        SPACES[Spaces Module]
        AI[AI Service]
    end

    subgraph "Externos"
        GITHUB[GitHub OAuth]
        OPENAI[OpenAI API]
        MONGO[MongoDB Atlas]
    end

    UI --> API
    AUTH --> GITHUB
    AI --> OPENAI
    API --> MONGO
    ARTICLES --> AI
```

## 🛠️ Stack Tecnológica

### Frontend

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **NextAuth.js** - Autenticação
- **React Hook Form** - Gerenciamento de formulários
- **Radix UI** - Componentes acessíveis

### Backend

- **NestJS** - Framework Node.js escalável
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **OpenAI API** - Inteligência Artificial
- **JWT** - Autenticação stateless
- **Class Validator** - Validação de dados

### DevOps & Ferramentas

- **Turbo** - Monorepo build system
- **pnpm** - Gerenciador de pacotes
- **ESLint + Prettier** - Qualidade de código
- **Jest** - Testes unitários e integração
- **GitHub Actions** - CI/CD

## 🚀 Setup Local

### Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Conta no MongoDB Atlas (gratuita)
- Conta no GitHub (para OAuth)
- Chave da OpenAI API (opcional, para features de IA)

### Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd kb-ia
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente (veja seção abaixo)

4. Execute o projeto:

```bash
pnpm dev
```

Isso iniciará:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia frontend e backend em modo dev
pnpm --filter web dev # Apenas frontend
pnpm --filter api dev # Apenas backend

# Build
pnpm build            # Build de todos os apps
pnpm --filter web build
pnpm --filter api build

# Testes
pnpm test             # Executa todos os testes
pnpm test:watch       # Modo watch
pnpm test:coverage    # Com cobertura

# Qualidade de código
pnpm lint:check       # Verifica erros de lint
pnpm lint:fix         # Corrige erros automaticamente
pnpm format:check     # Verifica formatação
pnpm format:fix       # Formata código

# Commits
pnpm commit           # Commit interativo com Commitizen
```

## 🔧 Variáveis de Ambiente

### Backend (`apps/api/.env`)

Copie o arquivo de exemplo:

```bash
cp apps/api/.env.example apps/api/.env
```

Variáveis necessárias:

| Variável         | Descrição                          | Obrigatório | Exemplo                                          |
| ---------------- | ---------------------------------- | ----------- | ------------------------------------------------ |
| `NODE_ENV`       | Ambiente de execução               | Sim         | `development` ou `production`                    |
| `PORT`           | Porta do servidor                  | Não         | `3001` (padrão)                                  |
| `MONGODB_URI`    | Connection string do MongoDB Atlas | Sim         | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `OPENAI_API_KEY` | Chave da API OpenAI                | Não\*       | `sk-...`                                         |
| `CORS_ORIGIN`    | Origem permitida para CORS         | Sim         | `http://localhost:3000`                          |

\*Necessário apenas para features de IA (geração de conteúdo e busca semântica)

### Frontend (`apps/web/.env.local`)

Copie o arquivo de exemplo:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Variáveis necessárias:

| Variável              | Descrição                   | Obrigatório | Exemplo                             |
| --------------------- | --------------------------- | ----------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL da API backend          | Sim         | `http://localhost:3001`             |
| `NEXTAUTH_URL`        | URL da aplicação frontend   | Sim         | `http://localhost:3000`             |
| `NEXTAUTH_SECRET`     | Chave secreta para NextAuth | Sim         | Gere com: `openssl rand -base64 32` |
| `GITHUB_ID`           | GitHub OAuth Client ID      | Sim         | Obtido no GitHub Developer Settings |
| `GITHUB_SECRET`       | GitHub OAuth Client Secret  | Sim         | Obtido no GitHub Developer Settings |

#### Como configurar GitHub OAuth

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Preencha:
   - **Application name**: Knowledge Base AI (ou qualquer nome)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Clique em "Register application"
5. Copie o **Client ID** e cole em `GITHUB_ID`
6. Clique em "Generate a new client secret"
7. Copie o **Client Secret** e cole em `GITHUB_SECRET`

## 🗄️ Configuração do MongoDB Atlas

### Passo a Passo

1. **Criar conta e cluster**
   - Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crie uma conta gratuita
   - Crie um novo cluster (Free Tier M0 - suficiente para o projeto)

2. **Configurar acesso**
   - Vá em "Database Access" → "Add New Database User"
   - Crie um usuário com senha (anote as credenciais)
   - Vá em "Network Access" → "Add IP Address"
   - Adicione seu IP atual ou `0.0.0.0/0` (permite qualquer IP - apenas para desenvolvimento)

3. **Obter connection string**
   - Clique em "Connect" no seu cluster
   - Selecione "Connect your application"
   - Copie a connection string (formato: `mongodb+srv://...`)
   - Substitua `<password>` pela senha do usuário criado
   - Adicione no arquivo `apps/api/.env` como `MONGODB_URI`

4. **Configurar Vector Search Index** (necessário para busca semântica)
   - Acesse seu cluster → "Browse Collections"
   - Selecione a collection `articles`
   - Vá em "Search Indexes" → "Create Search Index"
   - Selecione "JSON Editor" e cole:

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

   - Nomeie o índice como `vector_index`
   - Aguarde a criação (pode levar alguns minutos)

## 🔐 Configuração da Autenticação

O sistema usa **GitHub OAuth** via NextAuth.js para autenticação. Ao fazer login, você será redirecionado para o GitHub para autorizar a aplicação.

### Como funciona

1. Usuário clica em "Entrar com GitHub"
2. É redirecionado para o GitHub para autorizar
3. GitHub retorna com código de autorização
4. NextAuth.js cria uma sessão JWT
5. Usuário é redirecionado para o dashboard

### Decisões Arquiteturais

- **Por que GitHub OAuth?** Simplicidade e segurança - não precisamos gerenciar senhas
- **Por que JWT?** Sessões stateless, escaláveis e sem necessidade de banco de sessões
- **Por que NextAuth.js?** Abstração robusta, bem mantida e com suporte a múltiplos providers

## 🧪 Como Testar

### Executar Testes

```bash
# Todos os testes
pnpm test

# Apenas backend
pnpm --filter api test

# Apenas frontend
pnpm --filter web test

# Com cobertura
pnpm test:coverage

# Modo watch (desenvolvimento)
pnpm test:watch
```

### Cobertura de Testes

O projeto possui testes de integração para os fluxos críticos:

- ✅ Criação de artigos com geração automática de embeddings
- ✅ Busca vetorial semântica
- ✅ Geração de conteúdo com IA
- ✅ Autenticação e proteção de rotas
- ✅ CRUD de Spaces e Articles

### Testando Manualmente

#### 1. Criar um Space

```bash
curl -X POST http://localhost:3001/spaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Documentação Técnica",
    "description": "Artigos sobre arquitetura e boas práticas"
  }'
```

#### 2. Criar um Artigo

```bash
curl -X POST http://localhost:3001/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introdução ao TypeScript",
    "content": "TypeScript é um superset do JavaScript...",
    "spaceId": "<space-id>",
    "tags": ["typescript", "javascript"]
  }'
```

#### 3. Gerar Conteúdo com IA

```bash
curl -X POST http://localhost:3001/articles/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Escreva um artigo sobre Clean Code em TypeScript"
  }'
```

#### 4. Buscar Artigos (Busca Semântica)

```bash
curl "http://localhost:3001/articles/search?q=boas+práticas+de+código&limit=5"
```

#### 5. Upload de Arquivo

```bash
curl -X POST http://localhost:3001/articles/upload \
  -F "file=@documento.md" \
  -F "spaceId=<space-id>" \
  -F "tags[]=markdown" \
  -F "tags[]=documentacao"
```

## 🌐 Deploy em Produção

### 🔗 Links da Aplicação

- **Frontend**: [https://knowledge-base-ai-eosin.vercel.app/](https://knowledge-base-ai-eosin.vercel.app/)
- **API**: [https://api-production-43ba.up.railway.app/api/help](https://api-production-43ba.up.railway.app/api/help)

### 🚀 Plataformas Utilizadas

| Serviço        | Plataforma    | Tier      | Motivo da Escolha                                          |
| -------------- | ------------- | --------- | ---------------------------------------------------------- |
| Frontend       | Vercel        | Free      | Deploy automático, edge network, otimizado para Next.js    |
| Backend        | Railway       | Free      | Suporte a monorepo, fácil configuração, logs em tempo real |
| Banco de Dados | MongoDB Atlas | M0 (Free) | Vector Search, escalável, interface amigável               |

### 📋 Guia de Deploy

#### Deploy do Backend (Railway)

1. Crie uma conta no [Railway](https://railway.app/)
2. Conecte seu repositório GitHub
3. Configure o projeto:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm --filter api build`
   - **Start Command**: `pnpm --filter api start:prod`
4. Adicione as variáveis de ambiente (veja tabela abaixo)
5. Deploy automático será acionado

#### Deploy do Frontend (Vercel)

1. Crie uma conta na [Vercel](https://vercel.com/)
2. Importe o repositório GitHub
3. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
4. Adicione as variáveis de ambiente (veja tabela abaixo)
5. Deploy automático será acionado

### 🔐 Variáveis de Ambiente para Produção

#### Backend (Railway)

```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kb-ia
OPENAI_API_KEY=sk-proj-...
CORS_ORIGIN=https://knowledge-base-ai-eosin.vercel.app
```

#### Frontend (Vercel)

```bash
NEXT_PUBLIC_API_URL=https://api-production-43ba.up.railway.app
NEXTAUTH_URL=https://knowledge-base-ai-eosin.vercel.app
NEXTAUTH_SECRET=<gere-com-openssl-rand-base64-32>
GITHUB_ID=<seu-github-oauth-client-id>
GITHUB_SECRET=<seu-github-oauth-client-secret>
```

### ⚙️ Configurações Adicionais

#### GitHub OAuth para Produção

1. Vá em [GitHub Developer Settings](https://github.com/settings/developers)
2. Edite sua OAuth App ou crie uma nova
3. Atualize as URLs:
   - **Homepage URL**: `https://knowledge-base-ai-eosin.vercel.app`
   - **Authorization callback URL**: `https://knowledge-base-ai-eosin.vercel.app/api/auth/callback/github`

#### CORS no Backend

Certifique-se de que `CORS_ORIGIN` no Railway aponta para o domínio do Vercel.

### 🔄 CI/CD

O projeto possui GitHub Actions configurado que executa:

- ✅ Lint (ESLint + Prettier)
- ✅ Type checking (TypeScript)
- ✅ Testes unitários e de integração
- ✅ Build de produção

Todos os checks devem passar antes do merge para `main`.

## 🔧 Troubleshooting

### Problemas Comuns

#### Erro "Module not found" ou dependências desatualizadas

```bash
# Limpar cache e reinstalar
pnpm clean
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Erro de porta em uso

```bash
# Verificar processos usando as portas
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Matar processo específico
kill -9 <PID>

# Ou matar todos os processos Node.js
pkill -f node
```

#### Testes falhando

```bash
# Limpar cache do Jest
pnpm test --clearCache

# Executar testes em modo verbose
pnpm test --verbose

# Executar teste específico
pnpm test -- --testNamePattern="nome do teste"
```

#### Problemas com MongoDB

```bash
# Verificar conexão
ping cluster0.mongodb.net

# Testar connection string
mongosh "sua-connection-string"
```

#### Problemas com OpenAI API

```bash
# Testar chave da API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Build falhando

```bash
# Limpar cache do Turbo
pnpm turbo clean

# Build individual
pnpm --filter api build
pnpm --filter web build
```

### Logs e Debug

```bash
# Logs detalhados do backend
DEBUG=* pnpm --filter api dev

# Logs do frontend
pnpm --filter web dev --debug
```

## 📚 Estrutura de Dados

### Schema: Space

```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  authorId: string,
  settings: {
    primaryColor?: string,
    logo?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Schema: Article

```typescript
{
  _id: ObjectId,
  title: string,
  content: string,
  spaceId: ObjectId,
  authorId: string,
  tags: string[],
  content_vector: number[], // 1536 dimensions (OpenAI embedding)
  createdAt: Date,
  updatedAt: Date
}
```

## 📞 Contato e Suporte

Este projeto foi desenvolvido como parte de um desafio técnico. Para dúvidas ou sugestões sobre a implementação, entre em contato através do GitHub.

### Recursos Úteis

- [Documentação do NestJS](https://docs.nestjs.com/)
- [Documentação do Next.js](https://nextjs.org/docs)
- [MongoDB Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [NextAuth.js Documentation](https://next-auth.js.org/)

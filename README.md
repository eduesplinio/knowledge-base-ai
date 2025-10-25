# Knowledge Base AI

Base de Conhecimento interna potencializada por IA.

## Setup

### Instalação

```bash
pnpm install
```

### Executando o projeto

```bash
pnpm dev
```

Isso iniciará:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Variáveis de Ambiente

### Backend (`apps/api/.env`)

Copie o arquivo de exemplo:

```bash
cp apps/api/.env.example apps/api/.env
```

Variáveis necessárias:

- `NODE_ENV` - Ambiente (development/production)
- `PORT` - Porta do servidor (padrão: 3001)
- `MONGODB_URI` - Connection string do MongoDB Atlas
- `JWT_SECRET` - Chave secreta para JWT (gere uma chave aleatória segura)
- `JWT_EXPIRES_IN` - Tempo de expiração do token (ex: 7d, 24h, 30m)
- `OPENAI_API_KEY` - Chave da API OpenAI (opcional - necessário para features de IA)
- `CORS_ORIGIN` - Origem permitida para CORS (padrão: http://localhost:3000)

#### Como gerar JWT_SECRET

Você pode gerar uma chave segura usando:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

### Frontend (`apps/web/.env.local`)

Copie o arquivo de exemplo:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Variáveis necessárias:

- `NEXT_PUBLIC_API_URL` - URL da API (http://localhost:3001)
- `NEXTAUTH_URL` - URL da aplicação (http://localhost:3000)
- `NEXTAUTH_SECRET` - Chave secreta para NextAuth
- `GITHUB_ID` - GitHub OAuth Client ID (opcional)
- `GITHUB_SECRET` - GitHub OAuth Client Secret (opcional)

## Configuração do MongoDB Atlas

1. Crie uma conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um novo cluster (Free Tier M0)
3. Configure o acesso:
   - Adicione seu IP atual na whitelist
   - Crie um usuário de banco de dados
4. Obtenha a connection string:
   - Clique em "Connect" → "Connect your application"
   - Copie a connection string
   - Substitua `<password>` pela senha do usuário
   - Adicione no `.env` como `MONGODB_URI`

## Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. Após o login ou registro, o token é retornado e deve ser incluído no header `Authorization` das requisições:

```
Authorization: Bearer <seu-token-jwt>
```

### Endpoints de Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Obter dados do usuário autenticado (requer token)

## Troubleshooting

### Erro "Module not found"

```bash
pnpm clean
pnpm install
```

### Erro de porta em uso

```bash
# Verifique qual processo está usando a porta
lsof -i :3000
lsof -i :3001

# Mate o processo se necessário
kill -9 <PID>
```

### Testes falhando

```bash
pnpm test --clearCache
```

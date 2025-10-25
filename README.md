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
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRES_IN` - Tempo de expiração do token
- `OPENAI_API_KEY` - Chave da API OpenAI (opcional)
- `CORS_ORIGIN` - Origem permitida para CORS

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

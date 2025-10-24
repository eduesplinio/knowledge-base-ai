# Implementation Plan

## Etapa 0: Fundação e Configuração Inicial

- [ ] 1. Inicializar monorepo e configurar estrutura base
  - Executar `pnpm dlx shadcn@latest init` e selecionar opção de monorepo
  - Verificar criação do diretório `apps/web` com Next.js
  - Criar `pnpm-workspace.yaml` na raiz
  - Configurar `package.json` raiz com scripts básicos
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Criar aplicação NestJS (API)
  - Criar diretório `apps/api`
  - Executar `nest new .` dentro de `apps/api`
  - Configurar `package.json` do app api
  - Ajustar imports e estrutura para funcionar no monorepo
  - Testar execução com `pnpm --filter api dev`
  - _Requirements: 1.3, 1.5_

- [ ] 3. Configurar TypeScript strict mode
  - Criar `tsconfig.json` na raiz com `strict: true`
  - Configurar `tsconfig.json` específico para `apps/api` com decorators habilitados
  - Configurar `tsconfig.json` específico para `apps/web` com Next.js
  - Verificar que não há erros de compilação
  - _Requirements: 1.2.7_

- [ ] 4. Configurar ferramentas de qualidade de código
  - Instalar e configurar ESLint na raiz e em ambos apps
  - Instalar e configurar Prettier com `.prettierrc`
  - Criar `.eslintrc.json` com regras TypeScript
  - Criar `.prettierignore` e `.eslintignore`
  - Adicionar scripts `lint:check`, `lint:fix`, `format:check`, `format:fix` no root package.json
  - _Requirements: 1.1.1, 1.1.2, 1.1.7_

- [ ] 5. Configurar Git hooks e commits semânticos
  - Instalar Husky e executar `husky install`
  - Instalar Commitlint e criar `.commitlintrc.json`
  - Instalar lint-staged e configurar no `package.json`
  - Criar hook `.husky/pre-commit` para executar lint-staged
  - Criar hook `.husky/commit-msg` para validar mensagens de commit
  - Instalar Commitizen e configurar `cz-conventional-changelog`
  - Adicionar script `commit` no package.json
  - Testar criando um commit com `pnpm commit`
  - _Requirements: 1.1.3, 1.1.4, 1.1.6, 1.1.8_

- [ ] 6. Configurar infraestrutura de testes
  - Configurar Jest para `apps/api` com ts-jest
  - Configurar Jest para `apps/web` com jest-environment-jsdom
  - Criar arquivos de configuração `jest.config.js` em cada app
  - Adicionar scripts de teste no package.json de cada app
  - Criar teste de exemplo simples em cada app para validar setup
  - _Requirements: 1.2.1, 1.2.2, 1.2.3, 1.2.4_

- [ ] 7. Configurar GitHub Actions para CI/CD
  - Criar `.github/workflows/ci.yml`
  - Configurar job de lint (ESLint + Prettier)
  - Configurar job de testes para API
  - Configurar job de testes para Web
  - Configurar job de build
  - Definir status checks obrigatórios
  - _Requirements: 1.1.5, 1.1.9, 1.2.6_

- [ ] 8. Criar documentação inicial
  - Criar `README.md` na raiz com instruções de setup
  - Documentar comando `pnpm install`
  - Documentar comando `pnpm dev`
  - Criar `.env.example` para `apps/api`
  - Criar `.env.example` para `apps/web`
  - Listar todas as variáveis de ambiente necessárias
  - Adicionar seção de troubleshooting básico
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_



## Etapa 1: Estrutura Base e MVP

- [ ] 9. Configurar conexão com MongoDB Atlas
  - Criar conta no MongoDB Atlas (Free Tier)
  - Criar cluster e configurar acesso (usuário + IP)
  - Obter connection string
  - Instalar `@nestjs/mongoose` e `mongoose` no app api
  - Criar módulo de configuração para MongoDB
  - Configurar MongooseModule no `app.module.ts`
  - Adicionar variável `MONGODB_URI` no `.env` e `.env.example`
  - Testar conexão e verificar logs de sucesso
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 10. Criar schemas e models do MongoDB
  - Criar schema `User` com campos: name, email, password, avatar, timestamps
  - Criar schema `Space` com campos: name, description, authorId, settings, timestamps
  - Criar schema `Article` com campos: title, content, spaceId, authorId, tags, content_vector, timestamps
  - Adicionar índices apropriados em cada schema
  - Criar interfaces TypeScript correspondentes
  - _Requirements: 4.1, 5.1_

- [ ] 11. Implementar módulo de autenticação (Backend)
  - Criar módulo `auth` no NestJS
  - Instalar `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`
  - Criar `auth.service.ts` com métodos de login e registro
  - Implementar hash de senha com bcrypt
  - Criar `jwt.strategy.ts` para validação de tokens
  - Criar `auth.guard.ts` para proteger rotas
  - Criar DTOs: `LoginDto`, `RegisterDto`
  - Criar endpoints: POST /auth/login, POST /auth/register, GET /auth/me
  - Adicionar variáveis `JWT_SECRET` e `JWT_EXPIRES_IN` no .env
  - _Requirements: 2.3, 2.4_

- [ ]* 11.1 Escrever testes para autenticação
  - Criar testes unitários para `auth.service.ts`
  - Criar testes de integração para endpoints de autenticação
  - Testar cenários: login válido, login inválido, registro, token expirado
  - _Requirements: 1.2.9_

- [ ] 12. Configurar NextAuth no frontend
  - Instalar `next-auth` no app web
  - Criar `app/api/auth/[...nextauth]/route.ts`
  - Configurar CredentialsProvider
  - Configurar estratégia JWT
  - Implementar callbacks (jwt, session)
  - Adicionar variáveis `NEXTAUTH_URL` e `NEXTAUTH_SECRET` no .env.local
  - Criar provider de sessão no layout raiz
  - _Requirements: 2.1, 2.2_

- [ ] 13. Criar páginas de autenticação (Frontend)
  - Criar página `app/(auth)/login/page.tsx`
  - Criar página `app/(auth)/register/page.tsx`
  - Implementar formulários usando shadcn/ui (Input, Button, Card)
  - Integrar com NextAuth (signIn, signOut)
  - Adicionar validação de formulários
  - Implementar feedback de erros
  - _Requirements: 2.2, 2.3, 2.5_

- [ ] 14. Implementar proteção de rotas
  - Criar `middleware.ts` no app web usando `withAuth`
  - Configurar rotas protegidas (matcher)
  - Implementar redirecionamento para login quando não autenticado
  - Testar acesso a rotas protegidas sem autenticação
  - _Requirements: 2.2, 2.4_

- [ ] 15. Implementar CRUD de Spaces (Backend)
  - Criar módulo `spaces` no NestJS
  - Criar `spaces.service.ts` com métodos CRUD
  - Criar `spaces.controller.ts` com endpoints REST
  - Criar DTOs: `CreateSpaceDto`, `UpdateSpaceDto`
  - Implementar endpoints: GET /spaces, POST /spaces, GET /spaces/:id, PATCH /spaces/:id, DELETE /spaces/:id
  - Aplicar `AuthGuard` em todos os endpoints
  - Validar que authorId é preenchido com usuário autenticado
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 15.1 Escrever testes para Spaces
  - Criar testes unitários para `spaces.service.ts`
  - Criar testes de integração para endpoints de spaces
  - Testar CRUD completo e validações
  - _Requirements: 1.2.9_

- [ ] 16. Criar interface de Spaces (Frontend)
  - Criar componente `SpaceCard` usando shadcn/ui Card
  - Criar componente `SpaceForm` com formulário de criação/edição
  - Criar componente `SpaceList` para listar spaces
  - Criar página `app/(dashboard)/page.tsx` (lista de spaces)
  - Criar página `app/(dashboard)/spaces/new/page.tsx` (criar space)
  - Implementar chamadas à API usando fetch/axios
  - Adicionar loading states e error handling
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ] 17. Garantir responsividade da interface de Spaces
  - Aplicar classes TailwindCSS responsivas nos componentes
  - Testar layout em diferentes tamanhos de tela (mobile, tablet, desktop)
  - Ajustar grid/flex para adaptar em mobile
  - Verificar usabilidade em dispositivos móveis
  - _Requirements: 6.4_

- [ ] 18. Implementar CRUD de Articles (Backend)
  - Criar módulo `articles` no NestJS
  - Criar `articles.service.ts` com métodos CRUD
  - Criar `articles.controller.ts` com endpoints REST
  - Criar DTOs: `CreateArticleDto`, `UpdateArticleDto`
  - Implementar endpoints: GET /articles, POST /articles, GET /articles/:id, PATCH /articles/:id, DELETE /articles/:id
  - Adicionar filtro por spaceId na listagem
  - Aplicar `AuthGuard` em todos os endpoints
  - Por enquanto, deixar content_vector como null (será implementado na Etapa 2)
  - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [ ]* 18.1 Escrever testes para Articles
  - Criar testes unitários para `articles.service.ts`
  - Criar testes de integração para endpoints de articles
  - Testar CRUD completo, filtros e validações
  - _Requirements: 1.2.9_

- [ ] 19. Criar interface de Articles (Frontend)
  - Criar componente `ArticleCard` usando shadcn/ui Card
  - Criar componente `ArticleEditor` com Textarea para conteúdo
  - Criar componente `ArticleViewer` para renderizar artigo
  - Criar componente `ArticleList` para listar artigos
  - Criar página `app/(dashboard)/spaces/[id]/page.tsx` (detalhes do space + lista de artigos)
  - Criar página `app/(dashboard)/articles/new/page.tsx` (criar artigo)
  - Criar página `app/(dashboard)/articles/[id]/page.tsx` (visualizar artigo)
  - Criar página `app/(dashboard)/articles/[id]/edit/page.tsx` (editar artigo)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 20. Implementar renderização de conteúdo do artigo
  - Implementar visualização formatada do conteúdo (markdown ou texto)
  - Adicionar biblioteca de markdown se necessário (react-markdown)
  - Aplicar estilos apropriados para leitura
  - Testar renderização com diferentes tipos de conteúdo
  - _Requirements: 5.3, 7.3_

- [ ] 21. Garantir responsividade da interface de Articles
  - Aplicar classes TailwindCSS responsivas nos componentes
  - Testar editor e visualizador em diferentes tamanhos de tela
  - Ajustar layout para mobile
  - Verificar usabilidade em dispositivos móveis
  - _Requirements: 7.5_



## Etapa 2: Features de IA e Pesquisa

- [ ] 22. Criar módulo de integração com OpenAI
  - Criar módulo `ai` no NestJS
  - Instalar biblioteca `openai`
  - Criar `ai.service.ts` com métodos: `generateContent()` e `generateEmbedding()`
  - Implementar método `generateContent()` usando GPT-4
  - Implementar método `generateEmbedding()` usando text-embedding-3-small
  - Adicionar variável `OPENAI_API_KEY` no .env
  - Implementar tratamento de erros da API OpenAI
  - Adicionar logs para debugging
  - _Requirements: 8.3, 9.1_

- [ ]* 22.1 Escrever testes para AI Service
  - Criar testes unitários para `ai.service.ts` com mocks da OpenAI
  - Testar geração de conteúdo e embeddings
  - Testar tratamento de erros
  - _Requirements: 1.2.9_

- [ ] 23. Implementar endpoint de geração de conteúdo com IA
  - Criar DTO `GenerateContentDto` com campo prompt
  - Criar endpoint POST /articles/generate no `articles.controller.ts`
  - Integrar com `ai.service.generateContent()`
  - Retornar conteúdo gerado para o frontend
  - Implementar rate limiting básico (opcional)
  - Adicionar tratamento de erros específico
  - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 24. Adicionar geração de IA no editor de artigos (Frontend)
  - Adicionar campo de prompt no componente `ArticleEditor`
  - Adicionar botão "Gerar" usando shadcn/ui Button
  - Implementar chamada ao endpoint POST /articles/generate
  - Inserir conteúdo gerado no editor
  - Adicionar loading state durante geração
  - Implementar feedback de erro ao usuário
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [ ] 25. Implementar geração automática de embeddings
  - Modificar `articles.service.ts` para gerar embedding ao criar artigo
  - Chamar `ai.service.generateEmbedding()` com o conteúdo do artigo
  - Salvar embedding no campo `content_vector` do documento
  - Implementar regeneração de embedding ao atualizar artigo
  - Tratar caso de erro na geração (salvar artigo sem embedding)
  - Adicionar logs para tracking
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 25.1 Escrever testes para geração de embeddings
  - Criar testes para criação de artigo com embedding
  - Criar testes para atualização de artigo com regeneração de embedding
  - Testar cenário de erro na geração de embedding
  - _Requirements: 1.2.9_

- [ ] 26. Configurar Vector Search Index no MongoDB Atlas
  - Acessar MongoDB Atlas console
  - Navegar até a collection `articles`
  - Criar Search Index do tipo Vector
  - Configurar índice com: path=content_vector, dimensions=1536, similarity=cosine
  - Nomear índice como `vector_index`
  - Aguardar criação do índice (pode levar alguns minutos)
  - Verificar status do índice
  - _Requirements: 10.6_

- [ ] 27. Implementar busca vetorial semântica (Backend)
  - Criar endpoint GET /articles/search?q=query no `articles.controller.ts`
  - Implementar método `searchArticles()` no `articles.service.ts`
  - Gerar embedding da query de busca usando `ai.service.generateEmbedding()`
  - Executar aggregation pipeline com `$vectorSearch`
  - Retornar resultados ordenados por score de similaridade
  - Implementar paginação (limit)
  - Adicionar tratamento de erro caso índice não exista
  - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ]* 27.1 Escrever testes para busca vetorial
  - Criar testes de integração para endpoint de busca
  - Mockar geração de embedding e resultados do MongoDB
  - Testar diferentes queries e resultados
  - _Requirements: 1.2.9_

- [ ] 28. Criar interface de busca global (Frontend)
  - Criar componente `SearchBar` usando shadcn/ui Input
  - Adicionar SearchBar no layout principal (navbar)
  - Criar componente `SearchResults` para exibir resultados
  - Criar página `app/(dashboard)/search/page.tsx`
  - Implementar chamada ao endpoint GET /articles/search
  - Exibir resultados com score de relevância
  - Adicionar debounce na busca (opcional)
  - Implementar feedback quando não há resultados
  - _Requirements: 10.1, 10.4, 10.5_

- [ ] 29. Implementar upload de documentos (Backend)
  - Instalar biblioteca para parsing de arquivos (ex: multer)
  - Criar endpoint POST /articles/upload no `articles.controller.ts`
  - Configurar multer para aceitar apenas .md e .txt
  - Validar formato e tamanho do arquivo
  - Ler conteúdo do arquivo
  - Criar artigo com conteúdo do arquivo
  - Gerar embedding automaticamente
  - Retornar artigo criado
  - _Requirements: 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 30. Criar interface de upload (Frontend)
  - Criar componente `FileUpload` usando shadcn/ui
  - Adicionar botão de upload na página de artigos
  - Implementar seleção de arquivo (.md, .txt)
  - Validar arquivo antes de enviar
  - Implementar chamada ao endpoint POST /articles/upload
  - Adicionar progress indicator durante upload
  - Exibir mensagem de sucesso ou erro
  - Redirecionar para artigo criado após sucesso
  - _Requirements: 11.1, 11.2, 11.6_



## Etapa 3: Governança e Colaboração (Opcional)

- [ ] 31. Criar schema e modelo de permissões
  - Criar schema `Permission` com campos: userId, spaceId, role, timestamps
  - Definir enum de roles: VIEWER, EDITOR, ADMIN, OWNER
  - Adicionar índice composto único em userId + spaceId
  - Criar interface TypeScript correspondente
  - _Requirements: 12.1, 12.2_

- [ ] 32. Implementar módulo de permissões (Backend)
  - Criar módulo `permissions` no NestJS
  - Criar `permissions.service.ts` com métodos para gerenciar permissões
  - Implementar métodos: `assignPermission()`, `checkPermission()`, `getUserPermissions()`
  - Criar `permissions.controller.ts` com endpoints REST
  - Criar DTOs: `AssignPermissionDto`, `UpdatePermissionDto`
  - Implementar endpoints: GET /permissions/space/:spaceId, POST /permissions, DELETE /permissions/:id
  - _Requirements: 12.2, 12.5_

- [ ] 33. Criar Guard de permissões
  - Criar `permissions.guard.ts` no módulo permissions
  - Implementar lógica para verificar permissão do usuário no space
  - Criar decorator `@RequirePermission()` para especificar nível necessário
  - Integrar guard com `permissions.service.checkPermission()`
  - Retornar 403 Forbidden quando usuário não tem permissão
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ]* 33.1 Escrever testes para Guards de permissão
  - Criar testes unitários para `permissions.guard.ts`
  - Testar diferentes níveis de permissão
  - Testar bloqueio de acesso não autorizado
  - _Requirements: 1.2.9_

- [ ] 34. Aplicar Guards nos endpoints existentes
  - Adicionar `@RequirePermission('VIEWER')` em endpoints de leitura
  - Adicionar `@RequirePermission('EDITOR')` em endpoints de criação/edição de artigos
  - Adicionar `@RequirePermission('ADMIN')` em endpoints de gerenciamento de permissões
  - Adicionar `@RequirePermission('OWNER')` em endpoints de exclusão de space
  - Testar que permissões são respeitadas
  - _Requirements: 12.3, 12.4, 12.5, 13.4_

- [ ] 35. Implementar lógica de permissões no frontend
  - Criar hook `usePermissions()` para verificar permissões do usuário
  - Modificar componentes para ocultar botões baseado em permissão
  - Ocultar botão "Editar" para VIEWERs
  - Ocultar botão "Deletar" para não-OWNERs
  - Exibir opções de gerenciamento apenas para ADMINs/OWNERs
  - Implementar feedback quando ação não é permitida
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 36. Criar interface de gerenciamento de permissões
  - Criar componente `PermissionsManager` para listar e editar permissões
  - Criar página `app/(dashboard)/spaces/[id]/settings/page.tsx`
  - Implementar listagem de usuários com suas permissões
  - Adicionar formulário para atribuir/modificar permissões
  - Implementar chamadas aos endpoints de permissões
  - Restringir acesso apenas para ADMINs/OWNERs
  - _Requirements: 12.5, 14.3_

- [ ] 37. Criar schema de histórico de versões
  - Criar schema `ArticleVersion` com campos: articleId, content, authorId, createdAt
  - Adicionar índice composto em articleId + createdAt
  - Criar interface TypeScript correspondente
  - _Requirements: 15.1, 15.2_

- [ ] 38. Implementar salvamento de versões ao editar
  - Modificar `articles.service.updateArticle()` para salvar versão anterior
  - Antes de atualizar, salvar conteúdo atual em ArticleVersion
  - Incluir authorId de quem está editando e timestamp
  - Garantir que versão é salva antes da atualização
  - Implementar transação se possível
  - _Requirements: 15.1, 15.2_

- [ ] 39. Criar endpoint de histórico de versões
  - Criar endpoint GET /articles/:id/versions no `articles.controller.ts`
  - Implementar método `getArticleVersions()` no `articles.service.ts`
  - Retornar lista de versões ordenadas por data (mais recente primeiro)
  - Incluir informações do autor de cada versão
  - Implementar paginação
  - _Requirements: 15.3, 15.5_

- [ ] 40. Criar interface de histórico (Frontend)
  - Criar componente `VersionHistory` para listar versões
  - Criar componente `VersionViewer` para exibir conteúdo de uma versão
  - Adicionar aba ou botão "Histórico" na página do artigo
  - Implementar modal ou painel lateral para exibir histórico
  - Exibir lista de versões com autor e data
  - Permitir visualizar conteúdo de versão específica
  - Implementar diff visual (opcional)
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_



## Etapa 4: Features Bônus (Opcional)

- [ ] 41. Implementar workflow de publicação
  - Adicionar campo `status` ao schema Article (enum: DRAFT, IN_REVIEW, PUBLISHED)
  - Modificar criação de artigo para definir status inicial como DRAFT
  - Criar endpoint PATCH /articles/:id/status para mudar status
  - Implementar validação de permissões por status (EDITOR → IN_REVIEW, ADMIN → PUBLISHED)
  - Modificar listagem para filtrar artigos por status baseado em permissão
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 42. Criar interface de workflow no frontend
  - Adicionar indicador visual de status do artigo
  - Adicionar botões para mudar status (baseado em permissão)
  - Implementar chamada ao endpoint de mudança de status
  - Ocultar artigos DRAFT/IN_REVIEW de VIEWERs
  - Adicionar filtros por status na listagem
  - _Requirements: 17.4, 17.5_

- [ ] 43. Implementar personalização de Spaces
  - Adicionar campos `settings.primaryColor` e `settings.logo` ao schema Space
  - Criar endpoint PATCH /spaces/:id/settings
  - Implementar upload de logo
  - Validar formato de cor (hex)
  - Salvar configurações no banco
  - _Requirements: 18.1, 18.2, 18.3_

- [ ] 44. Aplicar personalização na interface
  - Carregar configurações do Space ao acessar
  - Aplicar cor primária usando CSS Variables
  - Exibir logo no cabeçalho do Space
  - Implementar fallback para tema padrão
  - Criar página de configurações de personalização (apenas ADMIN)
  - _Requirements: 18.2, 18.3, 18.4, 18.5_

- [ ] 45. Implementar sistema de webhooks
  - Criar schema `Webhook` com campos: spaceId, url, events, active, timestamps
  - Criar módulo `webhooks` no NestJS
  - Criar endpoints para gerenciar webhooks (CRUD)
  - Implementar método para disparar webhook
  - Integrar disparo de webhook ao publicar artigo
  - Implementar retry em caso de falha (opcional)
  - Adicionar logs de webhooks disparados
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 46. Criar interface de gerenciamento de webhooks
  - Criar componente `WebhookManager`
  - Adicionar na página de configurações do Space
  - Implementar formulário para registrar webhook
  - Listar webhooks configurados
  - Permitir ativar/desativar webhooks
  - Exibir logs de webhooks (opcional)
  - _Requirements: 19.1_

- [ ] 47. Adicionar comentários em edições
  - Adicionar campo `comment` ao schema ArticleVersion
  - Modificar salvamento de versão para incluir comentário opcional
  - Adicionar campo de comentário no formulário de edição
  - Salvar comentário junto com a versão
  - Exibir comentários no histórico de versões
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

## Finalização e Polimento

- [ ] 48. Revisar e atualizar documentação
  - Atualizar README.md com todas as features implementadas
  - Documentar todas as variáveis de ambiente
  - Adicionar screenshots (opcional)
  - Documentar processo de setup do MongoDB Atlas
  - Documentar processo de obtenção da chave OpenAI
  - Adicionar seção de troubleshooting expandida
  - Criar CONTRIBUTING.md (opcional)
  - _Requirements: 21.1, 21.2, 21.3, 21.5_

- [ ] 49. Executar testes completos
  - Executar todos os testes unitários
  - Executar todos os testes de integração
  - Verificar cobertura de código
  - Corrigir testes falhando
  - Adicionar testes para features críticas faltantes
  - _Requirements: 1.2.8_

- [ ] 50. Executar verificações de qualidade
  - Executar ESLint em todo o projeto
  - Executar Prettier em todo o projeto
  - Corrigir warnings e erros
  - Verificar que não há `any` desnecessários
  - Revisar imports não utilizados
  - _Requirements: 1.1.1, 1.1.2_

- [ ] 51. Testar fluxos end-to-end manualmente
  - Testar fluxo completo de registro e login
  - Testar criação de Space e Articles
  - Testar geração de conteúdo com IA
  - Testar busca vetorial semântica
  - Testar upload de documentos
  - Testar permissões (se implementado)
  - Testar histórico de versões (se implementado)
  - Testar em diferentes navegadores
  - Testar responsividade em mobile

- [ ] 52. Otimizações de performance (opcional)
  - Adicionar paginação em listagens grandes
  - Implementar lazy loading de componentes
  - Otimizar queries do MongoDB com índices
  - Adicionar cache para dados frequentes
  - Comprimir respostas da API

- [ ] 53. Preparar para entrega
  - Fazer commit final com mensagem descritiva
  - Verificar que .env não está commitado
  - Verificar que .env.example está atualizado
  - Criar tag de versão (v1.0.0)
  - Fazer push para repositório privado no GitHub
  - Verificar que CI/CD está passando
  - Revisar README uma última vez


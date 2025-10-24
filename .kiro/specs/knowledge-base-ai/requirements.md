# Requirements Document

## Introduction

Este documento descreve os requisitos para o desenvolvimento de uma Base de Conhecimento interna potencializada por IA. O sistema permitirá que usuários criem, organizem e pesquisem artigos de conhecimento usando recursos de inteligência artificial, incluindo geração de conteúdo e busca semântica vetorial.

O projeto será desenvolvido como um monorepo usando pnpm, com backend em NestJS, frontend em Next.js, MongoDB Atlas como banco de dados (incluindo Vector Search), NextAuth para autenticação e shadcn/ui para componentes de interface.

O desenvolvimento será dividido em 4 etapas progressivas, com foco inicial nas Etapas 1 e 2 (MVP + Features de IA), que representam o núcleo funcional do sistema.

## Requirements

### Requirement 1: Configuração Inicial do Projeto

**User Story:** Como desenvolvedor, eu quero configurar a estrutura base do monorepo, para que eu possa desenvolver o frontend e backend de forma organizada e seguindo as melhores práticas.

#### Acceptance Criteria

1. WHEN o comando `pnpm dlx shadcn@latest init` for executado THEN o sistema SHALL criar a estrutura base do monorepo
2. WHEN a opção de monorepo for selecionada no wizard THEN o sistema SHALL criar o diretório `apps/web` com Next.js configurado
3. WHEN o app NestJS for criado THEN o sistema SHALL estar localizado em `apps/api`
4. WHEN a estrutura estiver completa THEN o sistema SHALL ter shadcn/ui configurado no frontend
5. WHEN os comandos `pnpm install` e `pnpm dev` forem executados THEN ambos os apps SHALL iniciar corretamente

### Requirement 1.1: Configuração de Qualidade de Código e CI/CD

**User Story:** Como desenvolvedor, eu quero ter ferramentas de qualidade de código e CI/CD configuradas desde o início, para que o projeto mantenha padrões profissionais e commits semânticos.

#### Acceptance Criteria

1. WHEN o projeto for inicializado THEN o sistema SHALL ter ESLint configurado para ambos apps (web e api)
2. WHEN o projeto for inicializado THEN o sistema SHALL ter Prettier configurado com regras consistentes
3. WHEN Husky for configurado THEN o sistema SHALL validar commits com commitlint (conventional commits)
4. WHEN lint-staged for configurado THEN o sistema SHALL executar Prettier automaticamente em arquivos staged
5. WHEN GitHub Actions for configurado THEN o sistema SHALL executar checks de ESLint, Prettier e testes em PRs
6. WHEN commitizen for instalado THEN o sistema SHALL facilitar criação de commits semânticos via `pnpm commit`
7. WHEN scripts forem definidos THEN o package.json SHALL incluir: `lint:check`, `lint:fix`, `format:check`, `format:fix`
8. WHEN um commit não seguir padrão THEN o sistema SHALL bloquear o commit e exibir mensagem de erro
9. WHEN um PR for aberto THEN GitHub Actions SHALL executar status checks obrigatórios antes de merge

### Requirement 1.2: Configuração de Testes Automatizados

**User Story:** Como desenvolvedor, eu quero ter infraestrutura de testes configurada desde o início, para que eu possa garantir a qualidade e robustez do código através de testes automatizados.

#### Acceptance Criteria

1. WHEN o projeto for inicializado THEN o sistema SHALL ter Jest configurado para o app api (NestJS)
2. WHEN o projeto for inicializado THEN o sistema SHALL ter Jest configurado para o app web (Next.js)
3. WHEN testes forem executados THEN o sistema SHALL usar configuração específica para cada app do monorepo
4. WHEN scripts forem definidos THEN o package.json SHALL incluir: `test`, `test:watch`, `test:coverage`
5. WHEN testes de integração forem criados THEN o sistema SHALL permitir testar endpoints da API com banco de dados em memória ou mock
6. WHEN GitHub Actions executar THEN o sistema SHALL rodar todos os testes e bloquear merge se houver falhas
7. WHEN TypeScript for configurado THEN o sistema SHALL ter `strict: true` habilitado no tsconfig.json
8. WHEN coverage for gerado THEN o sistema SHALL exibir relatório de cobertura de código
9. WHEN testes críticos forem implementados THEN o sistema SHALL incluir: autenticação, CRUD de artigos, geração de embeddings, e Guards de permissão

### Requirement 2: Autenticação de Usuários

**User Story:** Como usuário, eu quero fazer login no sistema, para que eu possa acessar e gerenciar conteúdo de forma segura.

#### Acceptance Criteria

1. WHEN NextAuth for configurado THEN o sistema SHALL suportar autenticação via Credentials ou GitHub
2. WHEN um usuário não autenticado tentar acessar conteúdo THEN o sistema SHALL redirecionar para a página de login
3. WHEN um usuário fizer login com credenciais válidas THEN o sistema SHALL criar uma sessão autenticada
4. WHEN um usuário estiver autenticado THEN o sistema SHALL permitir acesso às funcionalidades protegidas
5. WHEN um usuário fizer logout THEN o sistema SHALL encerrar a sessão e redirecionar para login

### Requirement 3: Conexão com MongoDB Atlas

**User Story:** Como desenvolvedor, eu quero conectar a API ao MongoDB Atlas, para que eu possa persistir dados na nuvem sem configuração local.

#### Acceptance Criteria

1. WHEN a API for iniciada THEN o sistema SHALL conectar ao MongoDB Atlas usando a connection string fornecida
2. WHEN a conexão for estabelecida THEN o sistema SHALL registrar log de sucesso
3. WHEN a conexão falhar THEN o sistema SHALL registrar erro detalhado e não iniciar
4. WHEN variáveis de ambiente estiverem ausentes THEN o sistema SHALL exibir mensagem clara sobre configuração necessária

### Requirement 4: Gerenciamento de Spaces (Espaços)

**User Story:** Como usuário autenticado, eu quero criar e organizar Spaces, para que eu possa agrupar artigos relacionados por tema ou projeto.

#### Acceptance Criteria

1. WHEN um usuário criar um Space THEN o sistema SHALL salvar com nome, descrição e authorId
2. WHEN um usuário listar Spaces THEN o sistema SHALL retornar todos os Spaces disponíveis
3. WHEN um usuário visualizar um Space THEN o sistema SHALL exibir detalhes e lista de artigos associados
4. WHEN um usuário atualizar um Space THEN o sistema SHALL persistir as alterações
5. WHEN um usuário deletar um Space THEN o sistema SHALL remover o Space e manter integridade referencial

### Requirement 5: Gerenciamento de Articles (Artigos)

**User Story:** Como usuário autenticado, eu quero criar, editar e visualizar artigos dentro de Spaces, para que eu possa documentar e compartilhar conhecimento.

#### Acceptance Criteria

1. WHEN um artigo for criado THEN o sistema SHALL salvar title, content, spaceId, authorId, tags e content_vector
2. WHEN um usuário listar artigos de um Space THEN o sistema SHALL retornar todos os artigos daquele Space
3. WHEN um usuário visualizar um artigo THEN o sistema SHALL renderizar o conteúdo formatado corretamente
4. WHEN um usuário editar um artigo THEN o sistema SHALL atualizar os dados e regenerar o embedding
5. WHEN um usuário deletar um artigo THEN o sistema SHALL remover permanentemente

### Requirement 6: Interface Responsiva para Spaces

**User Story:** Como usuário, eu quero uma interface visual para gerenciar Spaces, para que eu possa navegar facilmente pelo sistema.

#### Acceptance Criteria

1. WHEN a página de Spaces for acessada THEN o sistema SHALL exibir lista de Spaces em cards usando shadcn/ui
2. WHEN o botão "Criar Space" for clicado THEN o sistema SHALL exibir formulário modal
3. WHEN um Space for clicado THEN o sistema SHALL navegar para a página de detalhes do Space
4. WHEN a interface for acessada em mobile THEN o sistema SHALL adaptar layout responsivamente
5. WHEN um Space for criado/editado THEN o sistema SHALL atualizar a lista em tempo real

### Requirement 7: Interface Responsiva para Articles

**User Story:** Como usuário, eu quero uma interface visual para gerenciar artigos dentro de Spaces, para que eu possa criar e editar conteúdo facilmente.

#### Acceptance Criteria

1. WHEN a página de um Space for acessada THEN o sistema SHALL exibir lista de artigos usando componentes shadcn/ui
2. WHEN o botão "Criar Artigo" for clicado THEN o sistema SHALL exibir editor de artigo
3. WHEN um artigo for visualizado THEN o sistema SHALL renderizar o conteúdo com formatação apropriada
4. WHEN o botão "Editar" for clicado THEN o sistema SHALL carregar o editor com conteúdo existente
5. WHEN a interface for acessada em diferentes dispositivos THEN o sistema SHALL manter usabilidade

### Requirement 8: Geração de Conteúdo com IA

**User Story:** Como usuário, eu quero gerar conteúdo de artigos usando IA, para que eu possa acelerar a criação de documentação.

#### Acceptance Criteria

1. WHEN o editor de artigo for aberto THEN o sistema SHALL exibir campo de prompt e botão "Gerar"
2. WHEN um usuário digitar um prompt e clicar "Gerar" THEN o sistema SHALL chamar a API do NestJS
3. WHEN a API receber a requisição THEN o sistema SHALL chamar a API da OpenAI com o prompt
4. WHEN a OpenAI retornar conteúdo THEN o sistema SHALL inserir o texto gerado no editor
5. WHEN houver erro na geração THEN o sistema SHALL exibir mensagem de erro clara ao usuário

### Requirement 9: Criação Automática de Embeddings

**User Story:** Como sistema, eu quero gerar embeddings vetoriais automaticamente para cada artigo, para que seja possível realizar buscas semânticas posteriormente.

#### Acceptance Criteria

1. WHEN um artigo for criado THEN o sistema SHALL gerar embedding do campo content usando OpenAI
2. WHEN um artigo for atualizado THEN o sistema SHALL regenerar o embedding automaticamente
3. WHEN o embedding for gerado THEN o sistema SHALL armazenar no campo content_vector do documento
4. WHEN houver erro na geração THEN o sistema SHALL registrar log mas não bloquear a criação do artigo
5. WHEN a API da OpenAI estiver indisponível THEN o sistema SHALL salvar o artigo sem embedding

### Requirement 10: Pesquisa Vetorial Semântica

**User Story:** Como usuário, eu quero pesquisar artigos usando linguagem natural, para que eu possa encontrar conteúdo relevante mesmo sem saber palavras-chave exatas.

#### Acceptance Criteria

1. WHEN a interface principal for carregada THEN o sistema SHALL exibir campo de pesquisa global
2. WHEN um usuário digitar uma query e pesquisar THEN o sistema SHALL gerar embedding da query
3. WHEN o embedding for gerado THEN o sistema SHALL usar $vectorSearch do MongoDB Atlas para buscar
4. WHEN resultados forem encontrados THEN o sistema SHALL exibir artigos ordenados por relevância (score)
5. WHEN nenhum resultado for encontrado THEN o sistema SHALL exibir mensagem apropriada
6. IF o índice vetorial não existir THEN o sistema SHALL exibir erro instruindo configuração no Atlas

### Requirement 11: Upload de Documentos

**User Story:** Como usuário, eu quero fazer upload de arquivos .md ou .txt, para que eu possa importar documentação existente para o sistema.

#### Acceptance Criteria

1. WHEN a interface de upload for acessada THEN o sistema SHALL permitir seleção de arquivos .md e .txt
2. WHEN um arquivo for selecionado THEN o sistema SHALL validar formato e tamanho
3. WHEN o upload for enviado THEN a API SHALL ler o conteúdo do arquivo
4. WHEN o conteúdo for lido THEN o sistema SHALL criar um novo artigo com o conteúdo
5. WHEN o artigo for criado THEN o sistema SHALL gerar embedding automaticamente
6. WHEN houver erro no upload THEN o sistema SHALL exibir mensagem de erro específica

### Requirement 12: Controle de Acesso por Níveis de Permissão

**User Story:** Como administrador, eu quero definir diferentes níveis de permissão para usuários, para que eu possa controlar quem pode visualizar, editar ou gerenciar conteúdo.

#### Acceptance Criteria

1. WHEN o sistema de permissões for implementado THEN o sistema SHALL suportar 4 níveis: VIEWER, EDITOR, ADMIN, OWNER
2. WHEN permissões forem atribuídas THEN o sistema SHALL associar permissão a um usuário em um Space específico
3. WHEN um VIEWER acessar um Space THEN o sistema SHALL permitir apenas leitura de artigos
4. WHEN um EDITOR acessar um Space THEN o sistema SHALL permitir criar e editar artigos
5. WHEN um ADMIN ou OWNER acessar um Space THEN o sistema SHALL permitir gerenciar permissões de outros usuários

### Requirement 13: Proteção de Endpoints com Guards

**User Story:** Como desenvolvedor, eu quero proteger endpoints da API com Guards, para que apenas usuários com permissões adequadas possam executar ações.

#### Acceptance Criteria

1. WHEN um endpoint protegido for chamado THEN o sistema SHALL verificar autenticação do usuário
2. WHEN a permissão for verificada THEN o sistema SHALL validar nível de acesso ao Space
3. WHEN o usuário não tiver permissão THEN o sistema SHALL retornar erro 403 Forbidden
4. WHEN o usuário tiver permissão THEN o sistema SHALL permitir execução da ação
5. WHEN Guards forem implementados THEN o sistema SHALL usar decorators do NestJS

### Requirement 14: Interface Adaptativa por Permissão

**User Story:** Como usuário, eu quero ver apenas as ações que tenho permissão para executar, para que a interface seja clara e evite tentativas de ações não autorizadas.

#### Acceptance Criteria

1. WHEN um VIEWER visualizar um artigo THEN o sistema SHALL ocultar botões de edição e exclusão
2. WHEN um EDITOR visualizar um artigo THEN o sistema SHALL exibir botões de edição
3. WHEN um ADMIN visualizar um Space THEN o sistema SHALL exibir opções de gerenciamento de permissões
4. WHEN permissões mudarem THEN o sistema SHALL atualizar interface dinamicamente
5. WHEN um usuário tentar ação não permitida via URL direta THEN a API SHALL bloquear

### Requirement 15: Histórico de Versões de Artigos

**User Story:** Como usuário, eu quero visualizar o histórico de edições de um artigo, para que eu possa rastrear mudanças e recuperar versões anteriores se necessário.

#### Acceptance Criteria

1. WHEN um artigo for editado THEN o sistema SHALL salvar versão anterior na collection ArticleVersion
2. WHEN uma versão for salva THEN o sistema SHALL incluir content, authorId e timestamp
3. WHEN um usuário acessar histórico THEN o sistema SHALL listar todas as versões do artigo
4. WHEN uma versão for selecionada THEN o sistema SHALL exibir conteúdo daquela versão
5. WHEN o histórico for exibido THEN o sistema SHALL mostrar quem editou e quando

### Requirement 16: Visualização de Histórico na Interface

**User Story:** Como usuário, eu quero acessar o histórico de edições através da interface do artigo, para que eu possa revisar mudanças facilmente.

#### Acceptance Criteria

1. WHEN um artigo for visualizado THEN o sistema SHALL exibir aba ou botão "Histórico"
2. WHEN o histórico for aberto THEN o sistema SHALL exibir lista de versões em modal ou painel lateral
3. WHEN uma versão for clicada THEN o sistema SHALL exibir diff ou conteúdo completo daquela versão
4. WHEN não houver histórico THEN o sistema SHALL exibir mensagem indicando primeira versão
5. WHEN o histórico for fechado THEN o sistema SHALL retornar à visualização normal do artigo

### Requirement 17: Workflow de Publicação (Bônus)

**User Story:** Como editor, eu quero que artigos passem por um fluxo de aprovação antes de serem publicados, para que haja controle de qualidade do conteúdo.

#### Acceptance Criteria

1. WHEN um artigo for criado THEN o sistema SHALL definir status inicial como DRAFT
2. WHEN um EDITOR finalizar edição THEN o sistema SHALL permitir mover para IN_REVIEW
3. WHEN um ADMIN revisar THEN o sistema SHALL permitir mover para PUBLISHED
4. WHEN um artigo estiver DRAFT ou IN_REVIEW THEN o sistema SHALL ocultar de VIEWERs
5. WHEN um artigo for PUBLISHED THEN o sistema SHALL tornar visível para todos com acesso ao Space

### Requirement 18: Personalização Visual de Spaces (Bônus)

**User Story:** Como administrador de um Space, eu quero personalizar a aparência visual, para que cada Space tenha identidade própria.

#### Acceptance Criteria

1. WHEN um ADMIN acessar configurações do Space THEN o sistema SHALL exibir opções de personalização
2. WHEN uma cor primária for definida THEN o sistema SHALL aplicar usando CSS Variables
3. WHEN um logo for enviado THEN o sistema SHALL armazenar e exibir no cabeçalho do Space
4. WHEN o Space for acessado THEN o sistema SHALL carregar personalizações automaticamente
5. WHEN personalizações forem removidas THEN o sistema SHALL retornar ao tema padrão

### Requirement 19: Notificações via Webhook (Bônus)

**User Story:** Como administrador, eu quero configurar webhooks para receber notificações de eventos, para que sistemas externos possam ser integrados.

#### Acceptance Criteria

1. WHEN um ADMIN acessar configurações THEN o sistema SHALL permitir registrar URL de webhook
2. WHEN um artigo for publicado THEN o sistema SHALL disparar POST para URL registrada
3. WHEN o webhook for disparado THEN o sistema SHALL enviar payload com dados do artigo
4. WHEN houver erro no webhook THEN o sistema SHALL registrar log mas não bloquear publicação
5. WHEN múltiplos webhooks forem registrados THEN o sistema SHALL disparar para todos

### Requirement 20: Comentários em Edições (Bônus)

**User Story:** Como editor, eu quero adicionar comentários ao salvar edições, para que outros usuários entendam o que foi modificado.

#### Acceptance Criteria

1. WHEN um artigo for editado THEN o sistema SHALL exibir campo opcional para comentário de edição
2. WHEN um comentário for adicionado THEN o sistema SHALL salvar junto com a ArticleVersion
3. WHEN o histórico for visualizado THEN o sistema SHALL exibir comentários de cada versão
4. WHEN nenhum comentário for adicionado THEN o sistema SHALL salvar versão normalmente
5. WHEN comentários forem exibidos THEN o sistema SHALL mostrar autor e timestamp

### Requirement 21: Documentação e Configuração

**User Story:** Como desenvolvedor avaliador, eu quero documentação clara de setup, para que eu possa executar o projeto facilmente.

#### Acceptance Criteria

1. WHEN o repositório for clonado THEN o sistema SHALL incluir README.md completo
2. WHEN o README for lido THEN o documento SHALL conter instruções de instalação com `pnpm install`
3. WHEN variáveis de ambiente forem necessárias THEN o README SHALL listar todas claramente
4. WHEN o comando `pnpm dev` for executado THEN ambos apps SHALL iniciar conforme documentado
5. WHEN houver configurações específicas THEN o README SHALL incluir seção de troubleshooting

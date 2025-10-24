# GitHub Setup Guide

## Passo 1: Criar Repositório

1. Acesse GitHub e crie novo repositório **PRIVADO**
2. Nome sugerido: `knowledge-base-ai`
3. Descrição: `Base de Conhecimento com IA - Avaliação Técnica`
4. **NÃO** inicialize com README (vamos criar localmente)
5. Copie a URL do repositório

## Passo 2: Criar Milestones

Acesse: `Repositório → Issues → Milestones → New milestone`

### Milestone 1: Fundação e Setup
- **Título**: 🏗️ Fundação e Setup
- **Due date**: 26 de Outubro de 2024
- **Description**: 
```
Configuração inicial do monorepo, ferramentas de qualidade, testes e CI/CD.
Tasks: 1-8
```

### Milestone 2: MVP - Etapa 1
- **Título**: 🚀 MVP - Etapa 1
- **Due date**: 30 de Outubro de 2024
- **Description**:
```
Autenticação, MongoDB, CRUD de Spaces e Articles, interfaces responsivas.
Tasks: 9-21
```

### Milestone 3: IA - Etapa 2
- **Título**: 🤖 IA - Etapa 2
- **Due date**: 02 de Novembro de 2024
- **Description**:
```
Integração OpenAI, geração de conteúdo, embeddings, busca vetorial, upload.
Tasks: 22-30
```

### Milestone 4: Polimento e Entrega
- **Título**: ✨ Polimento e Entrega
- **Due date**: 05 de Novembro de 2024
- **Description**:
```
Documentação final, testes, qualidade de código, preparação para entrega.
Tasks: 48-53
```

### Milestone 5: Governança - Etapa 3 (Opcional)
- **Título**: 🔐 Governança - Etapa 3 (Opcional)
- **Due date**: 04 de Novembro de 2024
- **Description**:
```
Sistema de permissões, Guards, histórico de versões.
Tasks: 31-40
```

### Milestone 6: Features Bônus - Etapa 4 (Opcional)
- **Título**: 🎁 Features Bônus - Etapa 4 (Opcional)
- **Due date**: 05 de Novembro de 2024
- **Description**:
```
Workflow de publicação, personalização, webhooks, comentários.
Tasks: 41-47
```



## Passo 3: Criar Labels

Acesse: `Repositório → Issues → Labels → New label`

| Nome | Cor | Descrição |
|------|-----|-----------|
| `setup` | `#0E8A16` | Configuração inicial e infraestrutura |
| `backend` | `#1D76DB` | Trabalho no NestJS/API |
| `frontend` | `#5319E7` | Trabalho no Next.js/Web |
| `ai` | `#E99695` | Features de IA e OpenAI |
| `testing` | `#FBCA04` | Testes unitários e integração |
| `docs` | `#0075CA` | Documentação |
| `optional` | `#D4C5F9` | Tasks opcionais |
| `bug` | `#D73A4A` | Algo não está funcionando |
| `enhancement` | `#A2EEEF` | Nova feature ou melhoria |

## Passo 4: Template de Issues

Use este template para criar as issues. Copie e cole no GitHub, ajustando os valores.

### Exemplo - Issue #1

**Título**: `Inicializar monorepo e configurar estrutura base`

**Labels**: `setup`, `backend`, `frontend`

**Milestone**: `🏗️ Fundação e Setup`

**Assignees**: Você mesmo

**Description**:
```markdown
## Task 1: Inicializar monorepo e configurar estrutura base

### Objetivo
Configurar a estrutura base do monorepo usando pnpm e shadcn.

### Checklist
- [ ] Executar `pnpm dlx shadcn@latest init` e selecionar opção de monorepo
- [ ] Verificar criação do diretório `apps/web` com Next.js
- [ ] Criar `pnpm-workspace.yaml` na raiz
- [ ] Configurar `package.json` raiz com scripts básicos
- [ ] Testar que estrutura está funcionando

### Requirements
_Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

### Critérios de Aceitação
- Monorepo inicializado com sucesso
- Apps web e api podem ser executados
- Estrutura de pastas está organizada

### Notas
Seguir exatamente as instruções da avaliação para o setup inicial.
```



## Passo 5: Script para Criar Issues em Massa (Opcional)

Se você quiser automatizar a criação de issues, pode usar a GitHub CLI (`gh`).

### Instalar GitHub CLI

```bash
# macOS
brew install gh

# Autenticar
gh auth login
```

### Script de Criação de Issues

Salve este script como `create-issues.sh`:

```bash
#!/bin/bash

# Issue 1
gh issue create \
  --title "Inicializar monorepo e configurar estrutura base" \
  --body "## Task 1
  
### Checklist
- [ ] Executar pnpm dlx shadcn@latest init
- [ ] Verificar criação do apps/web
- [ ] Criar pnpm-workspace.yaml
- [ ] Configurar package.json raiz
- [ ] Testar estrutura

**Requirements**: 1.1, 1.2, 1.3, 1.4, 1.5" \
  --label "setup,backend,frontend" \
  --milestone "🏗️ Fundação e Setup"

# Issue 2
gh issue create \
  --title "Criar aplicação NestJS (API)" \
  --body "## Task 2
  
### Checklist
- [ ] Criar diretório apps/api
- [ ] Executar nest new
- [ ] Configurar package.json
- [ ] Ajustar para monorepo
- [ ] Testar execução

**Requirements**: 1.3, 1.5" \
  --label "setup,backend" \
  --milestone "🏗️ Fundação e Setup"

# Continue para as outras issues...
```

**Nota**: Criar 53 issues manualmente pode ser trabalhoso. Recomendo:
1. Criar as issues das Etapas 0, 1 e 2 primeiro (tasks 1-30)
2. Criar as outras conforme avançar no projeto

## Passo 6: Organização do Board (Projects)

GitHub Projects pode ajudar a visualizar o progresso.

1. Acesse: `Repositório → Projects → New project`
2. Escolha template: `Board`
3. Nome: `Knowledge Base AI - Development`
4. Colunas sugeridas:
   - 📋 **Backlog** - Issues ainda não iniciadas
   - 🏗️ **In Progress** - Trabalhando agora
   - 👀 **Review** - Aguardando revisão
   - ✅ **Done** - Concluído

5. Adicione todas as issues ao projeto
6. Mova issues conforme progresso

## Passo 7: Estrutura de Branches

Sugestão de estratégia de branches:

```
main (branch principal - código estável)
  ├── develop (branch de desenvolvimento)
  │   ├── feature/setup-monorepo
  │   ├── feature/auth-backend
  │   ├── feature/auth-frontend
  │   ├── feature/spaces-crud
  │   ├── feature/articles-crud
  │   ├── feature/ai-integration
  │   ├── feature/vector-search
  │   └── ...
```

### Workflow Sugerido

1. Criar branch para cada feature: `git checkout -b feature/nome-da-feature`
2. Fazer commits semânticos: `git commit -m "feat: add user authentication"`
3. Push da branch: `git push origin feature/nome-da-feature`
4. Criar Pull Request para `develop`
5. Após CI passar, fazer merge
6. Deletar branch da feature

### Commits Semânticos

Exemplos de mensagens de commit:

```bash
feat: add user authentication with NextAuth
fix: resolve MongoDB connection timeout
docs: update README with setup instructions
style: format code with Prettier
refactor: reorganize API modules structure
test: add unit tests for auth service
chore: update dependencies
ci: add GitHub Actions workflow
perf: optimize vector search query
```

## Passo 8: Configurar Branch Protection (Opcional)

Para garantir qualidade:

1. Acesse: `Settings → Branches → Add rule`
2. Branch name pattern: `main`
3. Marcar:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. Selecionar checks obrigatórios: ESLint, Prettier, Tests

## Passo 9: Inicializar Git Localmente

Após criar o repositório no GitHub:

```bash
# Na raiz do projeto
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/knowledge-base-ai.git
git push -u origin main

# Criar branch develop
git checkout -b develop
git push -u origin develop
```

## Resumo do Fluxo de Trabalho

1. ✅ Criar repositório privado no GitHub
2. ✅ Criar milestones com prazos
3. ✅ Criar labels para organização
4. ✅ Criar issues para tasks prioritárias (1-30)
5. ✅ Configurar GitHub Projects (opcional)
6. ✅ Inicializar git localmente
7. ✅ Começar desenvolvimento!

### Dica de Produtividade

- **Manhã**: Revisar issues do dia, escolher próxima task
- **Durante desenvolvimento**: Fazer commits pequenos e frequentes
- **Fim do dia**: Atualizar status das issues, mover no board
- **Semanal**: Revisar progresso, ajustar prazos se necessário


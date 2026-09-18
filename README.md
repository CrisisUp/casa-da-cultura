# Casa da Cultura - Sistema de Cadastro de Artistas

Sistema web corporativo para gestão cultural e cadastro de artistas da Casa da Cultura, desenvolvido com tecnologias modernas de mercado.

## 🚀 Novidades e Melhorias Recentes (Arquitetura & Segurança)

- **Middleware de Autenticação Global**: Proteção de rotas `/api/*` contra acessos não autorizados.
- **Rate Limiting**: Proteção anti-DDoS e contra abuso por IP (`src/lib/rate-limit.ts`).
- **Validação Rigorosa com Zod**: Garantia de integridade de dados na entrada e saída de todas as entidades.
- **Soft-Delete & Status Dinâmico**: Suporte a deleção lógica e alternância em tempo real de status (`ATIVO` / `INATIVO`).
- **Artista em Destaque Manual**: Seleção direta via painel com feedback imediato via estrela de destaque.
- **Gestão de Usuários (RBAC Visual)**: Módulo exclusivo para administradores criarem e gerenciarem operadores e novos administradores.
- **Suíte de Testes Robusta**: Testes unitários/integração (Jest) e End-to-End (Playwright) 100% aprovados.

## Funcionalidades

- **Autenticação Segura**: Login com email/senha (NextAuth.js v5) e controle de acesso baseado em papéis (`ADMIN` e `OPERATOR`).
- **Dashboard Interativo**: Métricas, gráficos de distribuição por gênero e card de **Artista em Destaque** configurável.
- **CRUD Completo de Artistas**: Cadastro, edição, exclusão, filtros avançados, paginação e upload de foto.
- **Gestão de Eventos e Depoimentos**: Organização da agenda cultural e depoimentos institucionais.
- **Relatórios Dinâmicos**: Listagens e exportação de dados consolidados.
- **Gestão de Usuários (RBAC)**: Tela restrita para administradores gerenciarem contas e permissões do sistema.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend + Backend | Next.js 16 (App Router) + TypeScript |
| Estilização | Tailwind CSS v4 com Variáveis CSS Centralizadas |
| ORM & Banco | Prisma 6 + PostgreSQL |
| Autenticação | NextAuth.js v5 (beta) |
| Validação | Zod v4 |
| Testes | Jest + Playwright (E2E) |
| Ícones | Lucide React |

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente ou na nuvem
- npm ou yarn

## Instalação e Configuração

```bash
# 1. Clonar o repositório
git clone https://github.com/CrisisUp/casa-da-cultura.git
cd casa-da-cultura

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente (.env)
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/casa_da_cultura?schema=public"
# NEXTAUTH_SECRET="sua-chave-secreta-forte"

# 4. Sincronizar banco de dados e Prisma
npx prisma db push
npx prisma generate

# 5. Popular o banco com dados iniciais (seed)
npm run db:seed

# 6. Iniciar servidor de desenvolvimento
npm run dev
```

## Credenciais de Acesso Padrão

| Perfil | Email | Senha | Permissões |
|--------|-------|-------|------------|
| Administrador | admin@casa.gov.br | admin123 | Acesso total (CRUD, Gestão de Usuários, Destaques, Status) |
| Operador | operador@casa.gov.br | operador123 | Acesso operacional (CRUD de Artistas, Eventos, Depoimentos) |

## Comandos de Teste e Qualidade

```bash
npm test                # Executa testes unitários e de integração (Jest)
npm run test:coverage   # Verifica a cobertura de código
npx playwright test     # Executa testes E2E de ponta a ponta
```

## Licença

Projeto desenvolvido com padrões corporativos e acadêmicos.

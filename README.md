# Casa da Cultura - Sistema de Cadastro de Artistas

Sistema web para informatizar o cadastro de artistas de uma Casa da Cultura, desenvolvido como projeto acadêmico da FATEC.

## Funcionalidades

- **Autenticação**: Login com email/senha (NextAuth.js)
- **Dashboard**: Métricas e gráficos de artistas por gênero
- **CRUD de Artistas**: Cadastro completo com validação
- **Busca e Filtros**: Por nome, CPF, email, gênero e status
- **Upload de Foto**: Armazenamento local
- **Relatórios**: Listagem filtrada com exportação para impressão
- **Dois níveis de acesso**: Administrador e Operador

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend + Backend | Next.js 16 (App Router) + TypeScript |
| Estilização | Tailwind CSS v4 |
| ORM | Prisma 6 |
| Banco | PostgreSQL |
| Auth | NextAuth.js v5 (beta) |
| Ícones | Lucide React |

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente
- npm ou yarn

## Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
# Crie um banco PostgreSQL chamado "casa_da_cultura"

# Empurrar schema para o banco
npx prisma db push

# Popular com dados iniciais
npm run db:seed

# Iniciar servidor de desenvolvimento
npm run dev
```

## Credenciais de Acesso

| Perfil | Email | Senha |
|--------|-------|-------|
| Administrador | admin@casa.gov.br | admin123 |
| Operador | operador@casa.gov.br | operador123 |

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/login/        # Página de login
│   ├── (dashboard)/         # Áreas autenticadas
│   │   ├── page.tsx         # Dashboard
│   │   ├── artistas/        # CRUD de artistas
│   │   └── relatorios/      # Relatórios
│   └── api/                 # Rotas da API
├── components/
│   ├── ui/                  # Componentes base
│   ├── layout/              # Sidebar e Header
│   ├── dashboard/           # Gráficos e cards
│   └── artistas/            # Formulários e tabelas
└── lib/
    ├── prisma.ts            # Cliente Prisma
    ├── auth.ts              # Configuração NextAuth
    └── utils.ts             # Funções utilitárias
```

## Comandos Úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run db:seed      # Popular banco com dados de exemplo
npm run db:reset     # Resetar banco e recriar dados
```

## Licença

Projeto acadêmico - FATEC

# 🏛️ Arquitetura do Sistema — Casa da Cultura

Este documento descreve detalhadamente a arquitetura de software, padrões de design, fluxo de dados, segurança e tomada de decisões técnicas adotadas no desenvolvimento do sistema **Casa da Cultura**.

---

## 📐 1. Visão Geral da Arquitetura

O sistema adota o padrão **Full-Stack Monolith** utilizando **Next.js (App Router)**, combinando renderização do lado do servidor (SSR/RSC) com APIs RESTful internas (`Route Handlers`), garantindo alta performance, SEO e segurança nos dados sensíveis.

```text
  [ Cliente / Browser ]
         │
         ▼  (HTTPS / JWT Sessions)
  [ Middleware Global (/api/*) ] ──► Verificação de Sessão & RBAC
         │
         ▼
  [ Next.js App Router (RSC & Client Components) ]
         │
         ├──► Rotas de API (/api/*) ──► Validação (Zod) ──► Rate Limiting
         │                                                        │
         │                                                        ▼
         │                                            [ Prisma ORM (Client) ]
         │                                                        │
         │                                                        ▼
         └──────────────────────────────────────────────► [ PostgreSQL Database ]
```

---

## 🗂️ 2. Estrutura de Diretórios (Clean Structure)

A organização do código segue o princípio de separação de responsabilidades:

```text
casa-da-cultura/
├── prisma/
│   ├── schema.prisma       # Definição dos modelos, enums, índices compostos e soft-delete
│   └── seed.ts             # Script de população inicial do banco (Admin e Operador padrão)
├── src/
│   ├── app/                # Next.js App Router (Páginas e API Endpoints)
│   │   ├── api/            # Endpoints REST protegidos (artistas, depoimentos, eventos, stats, upload, usuários)
│   │   ├── dashboard/      # Painel administrativo autenticado (artistas, eventos, usuários, relatórios)
│   │   ├── login/          # Tela de autenticação
│   │   └── page.tsx        # Redirecionamento inicial
│   ├── components/         # Componentes React modularizados
│   │   ├── artistas/       # Tabelas, formulários e botões de destaque/status
│   │   ├── dashboard/      # Gráficos, cards de estatísticas, calendário
│   │   ├── layout/         # Sidebar cultural, header e navegação
│   │   └── ui/             # Componentes base reutilizáveis (Button, Input, Modal, Badge, Tabs)
│   └── lib/                # Camada de serviços, utilitários e regras de negócio
│       ├── api-response.ts # Padronização de respostas de sucesso e tratamento de erros (Prisma P2002, Zod)
│       ├── auth.ts         # Configuração do NextAuth.js v5 (JWT callbacks e credentials provider)
│       ├── constants.ts    # Enuns e mapeamentos de cores e status
│       ├── prisma.ts       # Instância global otimizada do Prisma Client
│       ├── rate-limit.ts   # Limitador de requisições por IP em memória
│       ├── utils.ts        # Formatadores (CPF, telefone, datas)
│       └── validations.ts  # Schemas estritos de validação com Zod
├── e2e/                    # Testes End-to-End com Playwright
├── TESTS.md                # Documentação da suíte de testes
└── README.md               # Documentação principal
```

---

## 🔒 3. Segurança e Controle de Acesso (RBAC)

A segurança foi implementada em múltiplas camadas para mitigar vulnerabilidades comuns (OWASP Top 10):

1. **Camada de Borda / Roteamento (`/middleware.ts`)**:
   - Intercepta todas as requisições direcionadas a `/api/*`.
   - Verifica a existência de uma sessão válida e o papel (`role`) do usuário.
   - Retorna `401 Unauthorized` ou `403 Forbidden` se o acesso não estiver autorizado.

2. **Camada de Aplicação e Rotas (`/api/usuarios/*`, etc.)**:
   - Verificação dupla de sessão dentro dos endpoints de API críticos.
   - Proteção estrita de rotas administrativas (ex: apenas `ADMIN` pode criar operadores ou alterar status de privilégio).

3. **Validação de Entrada (`Zod`)**:
   - Sanitização e validação de payloads em rotas de mutação (`POST`, `PUT`, `PATCH`), prevenindo injeções e corrupção de dados.

4. **Rate Limiting (`/lib/rate-limit.ts`)**:
   - Proteção de endpoints contra ataques de força bruta, limitando a 100 requisições por minuto por endereço IP.

---

## 🗄️ 4. Modelagem de Dados (Prisma Schema)

O banco de dados relacional (PostgreSQL) foi modelado com foco em integridade referencial, índices compostos para performance e suporte a auditoria:

- **Model `User`**: Gestão de operadores e administradores (`ADMIN`, `OPERATOR`) com senhas hash (`bcryptjs`).
- **Model `Artista`**: Cadastro completo de artistas. Inclui campos para soft-delete (`deletedAt`), controle de destaque manual (`destaque: Boolean`) e índices otimizados (`@@index([status, generoArtistico])`).
- **Model `Evento` & `Depoimento`**: Entidades de suporte à agenda cultural e depoimentos institucionais com relacionamentos consistentes.

---

## 🔄 5. Fluxos de Interação Chave

### A. Seleção Manual de Artista em Destaque
1. O administrador clica no ícone de estrela (`⭐`) na tabela de artistas (`/dashboard/artistas`).
2. O componente envia uma requisição `PATCH /api/artistas/[id]/destaque`.
3. O servidor transacionalmente limpa o destaque anterior (`destaque: false`) e define o novo (`destaque: true`).
4. O componente front-end (`SetFeaturedButton`) dispara o callback `onUpdate`, atualizando instantaneamente a tabela e o Banner Hero no dashboard sem necessidade de F5.

### B. Gestão Dinâmica de Status (`ATIVO` / `INATIVO`)
1. O administrador clica no botão de status na tabela.
2. Requisição `PATCH /api/artistas/[id]/status` atualiza o estado.
3. Se um artista for inativado, o sistema automaticamente desmarca seu status de destaque (`destaque = false`) por segurança, garantindo que inativos nunca apareçam no portal principal.

---

## 🧪 6. Estratégia de Testes

- **Unitários e Integração (`Jest`)**: Focados na lógica de negócio, validadores Zod, autenticação e rotas de API utilizando mocks para o Prisma Client.
- **End-to-End (`Playwright`)**: Simulam cenários reais no navegador (login, CRUD completo, paginação, filtros e validação de formulários).

---

## 🏁 Conclusão

Esta arquitetura garante que o sistema **Casa da Cultura** seja altamente modular, seguro contra acessos indevidos, fácil de manter e preparado para crescer de forma escalável em ambientes corporativos ou governamentais.

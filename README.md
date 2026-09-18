# 🏛️ Casa da Cultura: Sistema Corporativo de Gestão Cultural e Artistas

![CI](https://github.com/CrisisUp/casa-da-cultura/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748.svg)

Este projeto é um **sistema web corporativo full-stack** desenvolvido para informatizar e otimizar a gestão de artistas, eventos e depoimentos da Casa da Cultura. O sistema prioriza **segurança robusta (RBAC)**, **performance**, **experiência do usuário (UX)** e **integridade de dados**, oferecendo um painel administrativo completo e responsivo.

Construído com tecnologias modernas do ecossistema React/Next.js, o sistema implementa padrões avançados como autenticação segura, rate-limiting, tratamento de erros resiliente e testes automatizados de ponta a ponta.

---

## ✨ Funcionalidades em Destaque

* **Autenticação e Controle de Acesso (RBAC):**
  * Login seguro gerenciado via NextAuth.js v5 (beta).
  * Dois níveis de privilégio: **Administrador** (acesso total, gestão de usuários e privilégios) e **Operador** (gestão de cadastros e conteúdo).
* **Dashboard Interativo & Artista em Destaque:**
  * Métricas em tempo real (total de artistas, ativos, inativos e distribuição por gênero artístico).
  * Seleção dinâmica e manual de **Artista em Destaque** com atualização instantânea na interface (sem necessidade de recarregamento).
* **CRUD Completo de Artistas:**
  * Cadastro, edição, exclusão lógica (Soft-Delete) e alteração rápida de status (`ATIVO` / `INATIVO`).
  * Validação estrita de dados com Zod (incluindo validação de CPF e unicidade).
  * Busca em tempo real e filtros avançados por gênero e status.
* **Gestão de Eventos e Depoimentos:**
  * Organização de pautas, agenda cultural e depoimentos institucionais para engajamento público.
* **Módulo de Relatórios e Exportação:**
  * Geração de relatórios filtrados e exportação de dados consolidados.
* **Segurança e Resiliência Corporativa:**
  * **Middleware Global:** Proteção de todas as rotas `/api/*`.
  * **Rate Limiting:** Prevenção contra ataques de força bruta e abusos por IP.
  * **Auditoria:** Logs automáticos de exclusões e alterações críticas.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi meticulosamente construído utilizando tecnologias modernas e padrões de mercado:

* **Next.js 16 (App Router):** Framework React full-stack com renderização otimizada e rotas de API integradas.
* **TypeScript:** Tipagem estática rigorosa para garantir manutenibilidade e prevenir bugs em tempo de compilação.
* **Tailwind CSS v4:** Estilização utilitária avançada com design system cultural e variáveis CSS centralizadas (`globals.css`).
* **Prisma 6 & PostgreSQL:** ORM moderno e banco de dados relacional robusto com suporte a índices compostos.
* **Zod v4:** Validação de esquemas em runtime nas rotas de API e formulários.
* **NextAuth.js v5:** Sistema de autenticação baseado em sessões JWT e credenciais seguras com `bcryptjs`.
* **Jest & Playwright:** Suíte de testes abrangente cobrindo testes unitários, de integração e E2E (End-to-End).

---

## 🚀 Como Configurar e Rodar o Projeto

Para explorar este sistema em seu ambiente local, siga as instruções abaixo:

### Pré-requisitos

* **Node.js** versão 18 ou superior instalado ([Download Node.js](https://nodejs.org/)).
* **PostgreSQL** instalado e rodando localmente ou em uma instância na nuvem.
* **Git** instalado ([Download Git](https://git-scm.com/downloads)).

### Passos

1. **Clone o Repositório:**
    Abra seu terminal e execute o comando:

    ```bash
    git clone https://github.com/CrisisUp/casa-da-cultura.git
    ```

2. **Navegue até a Pasta do Projeto:**
    ```bash
    cd casa-da-cultura
    ```

3. **Instale as Dependências:**
    ```bash
    npm install
    ```

4. **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (baseado no ambiente local do PostgreSQL):
    ```env
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/casa_da_cultura?schema=public"
    NEXTAUTH_SECRET="sua-chave-secreta-forte-gerada-com-openssl"
    ```

5. **Configure o Banco de Dados e o Prisma:**
    ```bash
    # Sincroniza o schema com o banco PostgreSQL
    npx prisma db push

    # Gera o cliente Prisma otimizado
    npx prisma generate

    # Popula o banco com dados iniciais (Seed)
    npm run db:seed
    ```

6. **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    Abra o navegador em `http://localhost:3000`. O sistema redirecionará para a página de login.

---

## 🔑 Credenciais de Acesso Padrão (Seed)

Você pode utilizar as credenciais abaixo para testar os diferentes níveis de permissão:

| Perfil | Email | Senha | Permissões no Sistema |
|--------|-------|-------|------------------------|
| **Administrador** | `admin@casa.gov.br` | `admin123` | Acesso total: CRUD de artistas, Gestão de Usuários (RBAC), alteração de status e seleção de destaque. |
| **Operador** | `operador@casa.gov.br` | `operador123` | Acesso operacional: Cadastro, edição e visualização de artistas, eventos e depoimentos. |

---

## 🧪 Testes Automatizados

O projeto conta com uma suíte completa de testes cobrindo rotas de API, validações e fluxos de tela:

* **Testes Unitários e de Integração (Jest):**
  ```bash
  npm test
  ```
* **Cobertura de Código:**
  ```bash
  npm run test:coverage
  ```
* **Testes End-to-End (Playwright):**
  ```bash
  npx playwright test
  ```

---

## 🤝 Contribuição

Contribuições, sugestões e melhorias são sempre bem-vindas! Sinta-se à vontade para abrir uma [Issue](https://github.com/CrisisUp/casa-da-cultura/issues) ou enviar um [Pull Request](https://github.com/CrisisUp/casa-da-cultura/pulls).

---

## 📄 Licença

Este projeto é de código aberto sob a [Licença MIT](https://opensource.org/licenses/MIT).

---

## 📞 Contato

Para dúvidas ou sugestões, entre em contato via [GitHub](https://github.com/CrisisUp).

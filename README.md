# Casa da Cultura

Sistema web de gerenciamento de artistas, eventos e atividades culturais. Desenvolvido com Next.js, React, TypeScript, PostgreSQL e Prisma.

---

## 📋 Visão Geral

**Casa da Cultura** é uma aplicação full-stack moderna para:

- Cadastro e gestão de artistas
- Agendamento e controle de eventos
- Gerenciamento de atividades culturais
- Geração de relatórios em PDF
- Autenticação segura com NextAuth v5

**Stack tecnológico:**

- **Frontend:** React 19, Next.js 16.3.5 (App Router, Turbopack), TypeScript, Tailwind CSS
- **Backend:** Node.js, Next.js API Routes
- **Banco de dados:** PostgreSQL 12+
- **ORM:** Prisma 6.19.3
- **Autenticação:** NextAuth v5 (Auth.js)
- **Testes:** Jest (unitários), Playwright (E2E)

---

## ⚠️ PONTOS DE ATENÇÃO PARA WINDOWS

### 1. **PostgreSQL no Windows**

#### Instalação

- Baixe do [postgresql.org/download/windows](https://www.postgresql.org/download/windows)
- Durante a instalação, anote a **senha do usuário `postgres`**
- Escolha a porta padrão (**5432**) — não altere se puder
- Instale o **pgAdmin 4** (ferramentas de gerenciamento) junto

#### Conexão

A variável `DATABASE_URL` no `.env.local` deve usar o padrão:

```
postgresql://postgres:SUA_SENHA@localhost:5432/casa_da_cultura
```

Se usar caracteres especiais na senha, **URL-encode** eles:

- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`

Exemplo: senha `pass@word#123` vira `pass%40word%23123` na URL.

### 2. **Caminhos de Arquivo (Separadores)**

O projeto usa caminhos com `/` (Unix-style). No Windows, isso é suportado por Node.js e npm, **mas**:

- ✅ Mantemos `/` em toda a base de código (JavaScript/TypeScript)
- ⚠️ Variáveis de ambiente (`DATABASE_URL`) podem precisar de escapes
- ✅ A pasta `public/uploads` é criada automaticamente se não existir

**Nenhuma alteração necessária** — funciona nativamente.

### 3. **Line Endings (CRLF vs LF)**

Git no Windows converte automaticamente para `CRLF` (linhas do Windows). Isso pode causar problemas:

**Solução imediata (recomendada):**

```powershell
git config --global core.autocrlf false
```

Ou no repositório específico:

```powershell
git config core.autocrlf false
git rm --cached -r .
git reset --hard
```

### 4. **Terminal/Shell**

Use **PowerShell** ou **Windows Terminal** (não `cmd.exe`):

```powershell
# ✅ Correto
npm run dev

# ❌ Pode ter problemas
cmd.exe > npm run dev
```

**Alternativa:** WSL2 (Windows Subsystem for Linux 2) oferece experiência idêntica ao macOS. Se usar WSL2, instale PostgreSQL dentro do WSL.

### 5. **Node.js e npm no Windows**

- Baixe do [nodejs.org](https://nodejs.org) — versão LTS
- Instale como Administrator
- Reinicie o terminal após a instalação
- Verifique: `node --version` e `npm --version`

**Dica:** Use [nvm-windows](https://github.com/coreybutler/nvm-windows) se precisar alternar entre versões Node.

### 6. **Variáveis de Ambiente (.env.local)**

Crie o arquivo `.env.local` na raiz do projeto com:

```env
# Database (substitua SUA_SENHA pela senha do PostgreSQL)
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/casa_da_cultura"

# NextAuth
NEXTAUTH_SECRET="dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **Nunca** commite `.env.local` — está em `.gitignore`.

### 7. **Diretório de Uploads**

A pasta `public/uploads` é criada automaticamente na primeira tentativa de upload. Se quiser criar manualmente:

```powershell
# PowerShell
mkdir -p public/uploads
```

Se usar `cmd.exe`:

```cmd
mkdir public\uploads
```

### 8. **Permissões de Arquivo**

Windows gerencia permissões diferente de Unix. Se tiver problemas ao:

- Deletar arquivos em `public/uploads`
- Executar scripts `postinstall`

Soluções:

- Execute o terminal como **Administrator**
- Feche processos Node.js (`Ctrl+C` em todos os terminals)
- Limpe a cache do npm: `npm cache clean --force`

### 9. **bcryptjs no Windows**

O projeto usa `bcryptjs` (compatível com Windows). Se usar `bcrypt` nativo, instalará dependências C++ — evite isso no Windows.

---

## 🚀 Início Rápido

### Pré-requisitos (Mínimo)

- **Node.js 18+** (recomendado: 20 LTS)
- **npm 9+** ou **yarn**
- **PostgreSQL 12+** (com acesso local)
- **Git** (para clonar o repositório)

### 1. Clone e Instale Dependências

```bash
git clone <REPO_URL>
cd casa-da-cultura

npm install
```

Isso executa automaticamente `prisma generate` (hook `postinstall`).

### 2. Configure o Banco de Dados

#### Crie o banco

```bash
# Usando psql (PostgreSQL CLI)
createdb -U postgres casa_da_cultura

# Ou via pgAdmin 4 (interface gráfica no Windows)
```

#### Configure `.env.local`

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais PostgreSQL.

#### Inicie o schema

```bash
npm run db:push
```

Isso cria as tabelas no PostgreSQL.

#### Popule dados de exemplo (opcional)

```bash
npm run db:seed
```

Cria usuários de teste e dados de exemplo.

### 3. Inicie o Servidor

```bash
npm run dev
```

Servidor rodará em `http://localhost:3000`

---

## 📦 Scripts Disponíveis

| Script | Descrição |
| ------ | --------- |
| `npm run dev` | Inicia servidor de desenvolvimento com Hot Reload |
| `npm run build` | Build otimizado para produção |
| `npm start` | Inicia servidor de produção (requer `npm run build` antes) |
| `npm run lint` | Verifica style/erros com ESLint |
| `npm test` | Executa testes unitários (Jest) |
| `npm run test:watch` | Testes em modo watch (reexecuta ao salvar) |
| `npm run test:coverage` | Relatório de cobertura de testes |
| `npm run test:e2e` | Testes E2E (Playwright) |
| `npm run test:e2e:ui` | Testes E2E com interface visual |
| `npm run db:generate` | Regenera Prisma Client |
| `npm run db:push` | Sincroniza schema com banco de dados |
| `npm run db:seed` | Popula banco com dados de exemplo |
| `npm run db:reset` | ⚠️ Reseta banco e recarrega dados (DESTRUTIVO) |

---

## 🗂️ Estrutura de Pastas

```text
casa-da-cultura/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   │   └── upload/               # Upload de arquivos
│   │   ├── (auth)/                   # Layout para páginas de auth
│   │   ├── dashboard/                # Dashboard da aplicação
│   │   └── layout.tsx                # Layout raiz
│   ├── components/                   # Componentes React reutilizáveis
│   ├── lib/                          # Utilitários
│   │   ├── auth.ts                   # Configuração NextAuth
│   │   ├── prisma.ts                 # Cliente Prisma singleton
│   │   └── authOptions.ts            # Opções auth (legacy)
│   └── types/                        # Tipos TypeScript
├── prisma/
│   ├── schema.prisma                 # Schema do banco de dados
│   └── seed.ts                       # Script de seeding
├── public/
│   ├── uploads/                      # ⬅️ Diretório para uploads (criado automaticamente)
│   └── ...                           # Imagens estáticas, favicon, etc
├── e2e/                              # Testes E2E (Playwright)
├── .env.example                      # Exemplo de variáveis de ambiente
├── .env.local                        # ⬅️ Suas credenciais (NÃO commitar)
├── next.config.ts                    # Config Next.js
├── tsconfig.json                     # Config TypeScript
├── package.json                      # Dependências
├── jest.config.js                    # Config Jest
├── playwright.config.ts              # Config Playwright
└── README.md                         # Este arquivo

```

---

## 🔑 Variáveis de Ambiente

### Obrigatórias

| Variável | Exemplo | Descrição |
| -------- | ------- | --------- |
| `DATABASE_URL` | `postgresql://postgres:pass@localhost:5432/casa_da_cultura` | URL de conexão PostgreSQL |
| `NEXTAUTH_SECRET` | `dev-secret-xyz...` | Chave secreta para JWT (NextAuth) |
| `NEXTAUTH_URL` | `http://localhost:3000` | URL base da aplicação |

### Opcionais

| Variável | Padrão | Descrição |
| -------- | ------ | --------- |
| `NODE_ENV` | `development` | Ambiente (development/production) |

### Geração de `NEXTAUTH_SECRET` Segura

Para produção, gere um secret forte:

**No Terminal/PowerShell:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**No PowerShell (nativo Windows):**

```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## 🔐 Autenticação

### NextAuth v5 (Auth.js)

- **Estratégia:** JWT + Credentials Provider
- **Banco de dados:** PostgreSQL (armazena usuários)
- **Roles:** ADMIN e OPERATOR
- **Página de login:** `/login`

### Usuários de Teste (após `npm run db:seed`)

| Email | Senha | Role |
|-------|-------|------|
| `admin@example.com` | `admin123` | ADMIN |
| `operator@example.com` | `operator123` | OPERATOR |

---

## 🔧 Troubleshooting

### Erro: `MissingSecret`

**Problema:** NextAuth complaina sobre falta de secret.

**Solução:**

1. Verifique se `.env.local` existe e está lido
2. Verifique se `NEXTAUTH_SECRET` está definido
3. Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: `ECONNREFUSED: connection refused 127.0.0.1:5432`

**Problema:** Não consegue conectar ao PostgreSQL.

**Solução:**

1. Verifique se PostgreSQL está rodando:
   - **Windows:** Abra Services (`services.msc`), procure por "postgresql"
   - **PowerShell:** `Get-Service | grep postgres`
2. Verifique `DATABASE_URL` em `.env.local`
3. Teste conexão manualmente:

   ```bash
   psql -U postgres -c "SELECT 1"
   ```

### Erro: `ENOENT: no such file or directory ... public/uploads`

**Problema:** Diretório de uploads não existe.

**Solução:** Será criado automaticamente na primeira tentativa de upload. Ou crie manualmente:

```bash
mkdir -p public/uploads
```

### Slow Build no Windows (Turbopack)

**Problema:** Build muito lento com Turbopack.

**Soluções:**

1. Desative proteção antivírus para `node_modules/`
2. Use WSL2 em vez de Windows nativo
3. Aumente `NEXT_TELEMETRY_DISABLED=1` em `.env.local`

### Git CRLF Warnings

**Problema:** Avisos sobre `CRLF` ao commitar.

**Solução:** Configure Git para não alterar line endings (já mencionado acima):

```powershell
git config core.autocrlf false
```

---

## 🧪 Testes

### Unitários (Jest)

```bash
npm test
npm run test:watch          # Watch mode
npm run test:coverage       # Com cobertura
```

### E2E (Playwright)

```bash
npm run test:e2e            # Headless
npm run test:e2e:ui         # Com interface visual
npm run test:e2e:debug      # Modo debug (inspect)
```

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
npm start
```

### Variáveis de Produção

Configure estas variáveis no servidor:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-db.com:5432/casa_da_cultura
NEXTAUTH_SECRET=<GERADO_COM_COMANDO_ACIMA>
NEXTAUTH_URL=https://seu-dominio.com
```

### Suporta

- **Vercel** (recomendado para Next.js)
- **Docker** (veja `next.config.ts` com `output: "standalone"`)
- **Railway, Render, Fly.io, etc**

---

## 👥 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Faça suas alterações
3. Execute testes: `npm run test && npm run test:e2e`
4. Commit: `git commit -m "Descreva a mudança"`
5. Push e abra um Pull Request

---

## 📝 Licença

[Definir licença aqui — ex: MIT, Apache 2.0, etc]

---

## 📞 Suporte

Para dúvidas específicas do Windows:

1. Verifique a seção **PONTOS DE ATENÇÃO PARA WINDOWS** acima
2. Consulte [Next.js docs](https://nextjs.org/docs)
3. Consulte [Prisma docs](https://www.prisma.io/docs)
4. Consulte [NextAuth docs](https://authjs.dev)

---

**Última atualização:** Outubro 2026 | **Versão do projeto:** 0.1.0

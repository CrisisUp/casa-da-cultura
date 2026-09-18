# 🧪 Suite de Testes — Casa da Cultura

> Documentação completa para testar, validar e garantir a qualidade do sistema de gestão da Casa da Cultura.

---

## ✅ Visão Geral Atualizada (2026-09-18)

O projeto conta com **135 testes automatizados** (Jest) e **23 testes E2E** (Playwright), todos **100% aprovados**.

| Camada | Framework | Quantidade | Status |
|--------|-----------|------------|--------|
| Testes Unitários & Integração (API + Libs) | Jest | **135 testes** | ✅ Todos passaram |
| Testes End-to-End (E2E) | Playwright | **23 testes** | ✅ Todos passaram |
| **Total** | — | **158 testes** | ✅ **100% verde** |

---

## 🧱 1. Testes de Integração — APIs (`Jest`)

Cobrem os fluxos completos das rotas de API:

| Rota | Arquivo | Cobertura |
|-------|---------|-----------|
| `GET/POST /api/artistas` | `src/app/api/artistas/__tests__/route.test.ts` | Listagem, paginação, filtros, criação e validação de CPF duplicado |
| `GET/PUT/DELETE /api/artistas/[id]` | `src/app/api/artistas/[id]/__tests__/route.test.ts` | Busca por ID, edição, Soft-Delete e auditoria |
| `GET/POST /api/depoimentos` | `src/app/api/depoimentos/__tests__/route.test.ts` | CRUD e listagem de depoimentos |
| `GET/PUT/DELETE /api/depoimentos/[id]` | `src/app/api/depoimentos/[id]/__tests__/route.test.ts` | Manipulação individual e validação |
| `GET/POST /api/eventos` | `src/app/api/eventos/__tests__/route.test.ts` | CRUD e filtros de eventos |
| `GET/PUT/DELETE /api/eventos/[id]` | `src/app/api/eventos/[id]/__tests__/route.test.ts` | Manipulação individual com auditoria |
| `GET /api/stats` | `src/app/api/stats/__tests__/route.test.ts` | Métricas e estatísticas do dashboard |
| `POST /api/upload` | `src/app/api/upload/__tests__/route.test.ts` | Upload seguro (tamanho 5MB, MIME types e nome UUID) |

---

## 🧠 2. Testes Unitários — `src/lib` (`Jest`)

| Módulo | Arquivo | Cenários Validados |
|--------|---------|--------------------|
| **Auth** (NextAuth) | `src/lib/__tests__/auth.test.ts` | Login com credenciais, sessão JWT, dados do usuário e roles |
| **Validações (Zod)** | `src/lib/__tests__/validations.test.ts` | CPF válido/inválido, telefone, email, formatos e esquemas completos |
| **Utils de Formatação** | `src/lib/__tests__/utils.test.ts` | Formatação de CPF, datas, telefone e utility functions |

---

## 🕹️ 3. Testes End-to-End (E2E) — Playwright

Os testes E2E simulam a experiência completa do usuário real no navegador (autenticação + CRUD + validação):

| Arquivo | Fluxos Validados |
|---------|------------------|
| `e2e/auth.spec.ts` | Login, redirecionamento e controle de acesso (RBAC) |
| `e2e/artistas-crud.spec.ts` | Criação, edição, deleção, paginação, filtros, busca e validação de formulário |
| `e2e/depoimentos-eventos.spec.ts` | CRUD de depoimentos e eventos |
| `e2e/main.e2e.spec.ts` | Smoke tests da navegação principal |

---

## ⚙️ Como Executar os Testes

```bash
# 1. Testes unitários e de integração (Jest)
npm test

# 2. Com relatório de cobertura de código
npm run test:coverage

# 3. Modo watch (desenvolvimento contínuo)
npm test:watch

# 4. Testes E2E (Playwright — precisa do dev server rodando)
npx playwright test

# 5. Testes E2E com interface gráfica para depuração
npx playwright test --ui
```

### Testes Específicos

```bash
# Rodar apenas um arquivo de teste
npm test -- artistas/route.test

# Rodar apenas um módulo específico
npm test -- validations.test
```

---

## 📊 Cobertura de Código (Thresholds do Jest)

O projeto mantém cobertura de código satisfatória e metas rigorosas:

| Métrica | Meta |
|---------|------|
| **Branches (ramificações)** | 70%+ |
| **Functions (funções)** | 80%+ |
| **Lines (linhas)** | 80%+ |
| **Statements (declarações)** | 80%+ |

> Como gerar: `npm run test:coverage` → relatório completo em `coverage/`.

---

## 🔐 Disciplinas de Segurança Validadas

Os testes confirmam a robustez e resiliência do sistema:

* ✅ **Rate Limiting**: Proteção contra requisições abusivas.
* ✅ **Tratamento de Erros do Prisma (`P2002`)**: Duplicidade de CPF/email mapeada para status `400`.
* ✅ **Auditoria de Ações**: Logs de exclusão e upload (rastreabilidade).
* ✅ **Validação de Upload**: Limite de 5MB, restrição de MIME types e nomes UUID únicos.
* ✅ **RBAC (Controle de Acesso)**: Middleware de sessão e checagem de privilégios `ADMIN`/`OPERATOR`.

---

## 📝 Notas Técnicas

* **Sem dependência de banco real**: Prisma é mockado nos testes unitários.
* **Ambiente de execução**: Node puro (grande parte), JSDOM para componentes React.
* **Seed**: Necessário para dados realistas em ambientes de desenvolvimento e E2E.

---

## 🗓️ Última Atualização

* **Data**: 2026-09-18
* **Total Jest**: 135 testes
* **Total Playwright**: 23 testes
* **Status Geral**: ✅ 100% aprovado — pronto para CI/CD
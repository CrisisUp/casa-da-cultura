# Suite de Testes - Casa da Cultura

## ✅ Pronto para Usar

**118 testes** criados cobrindo APIs, validações e autenticação.

### Testes de Integração - APIs (43 testes)

| Rota | Arquivo | Testes |
|------|---------|--------|
| `GET/POST /api/artistas` | `src/app/api/artistas/__tests__/route.test.ts` | 9 testes |
| `GET/PUT/DELETE /api/artistas/[id]` | `src/app/api/artistas/[id]/__tests__/route.test.ts` | 9 testes |
| `GET/POST /api/depoimentos` | `src/app/api/depoimentos/__tests__/route.test.ts` | 7 testes |
| `GET/PUT/DELETE /api/depoimentos/[id]` | `src/app/api/depoimentos/[id]/__tests__/route.test.ts` | 9 testes |
| `GET/POST /api/eventos` | `src/app/api/eventos/__tests__/route.test.ts` | 7 testes |
| `GET/PUT/DELETE /api/eventos/[id]` | `src/app/api/eventos/[id]/__tests__/route.test.ts` | 9 testes |
| `GET /api/stats` | `src/app/api/stats/__tests__/route.test.ts` | 5 testes |
| `POST /api/upload` | `src/app/api/upload/__tests__/route.test.ts` | 9 testes |

### Testes Unitários - Libs (65 testes)

| Módulo | Arquivo | Testes |
|--------|---------|--------|
| Auth | `src/lib/__tests__/auth.test.ts` | 11 testes |
| Validações | `src/lib/__tests__/validations.test.ts` | 39 testes |
| Utils | `src/lib/__tests__/utils.test.ts` | 15 testes |

## Rodando os Testes

```bash
# Todos os testes
npm test

# Com coverage report
npm test:coverage

# Watch mode (desenvolvimento)
npm test:watch

# Testes específicos
npm test -- artistas/route.test
npm test -- validations.test
```

## O que Está Testado

✅ **Validação de entrada**
- CPF, telefone, email, formatos
- Zod schemas completos

✅ **CRUD completo**
- POST (create)
- GET (list + single)
- PUT (update)
- DELETE (remove)

✅ **Paginação e filtros**
- skip/take cálculos
- search, genero, status
- proximos (eventos futuros)

✅ **Segurança**
- Upload: file size (5MB max), MIME types
- Duplicate detection (CPF/email)
- CPF/telefone formatting

✅ **Error Handling**
- 400 (validação)
- 404 (not found)
- 413 (payload too large)
- 415 (unsupported media type)
- 500 (server error)

✅ **Autenticação**
- Credentials provider
- JWT callbacks
- Session data

✅ **Audit logs**
- Registro de DELETE
- Registro de upload

## Configuração

**Jest config** (`jest.config.js`):
- Environment: jsdom
- TS support: ts-jest
- Coverage thresholds: 70% branches, 80% functions/lines/statements

**Mocks**:
- Prisma: todos os modelos mocados
- Crypto: randomUUID fixo para testes
- fs/promises: writeFile mockado
- bcryptjs: comparação mockada
- NextAuth: callbacks testados isoladamente

## Coverage Esperado

Com `npm test:coverage`:
- **Global**: 70%+ branches, 80%+ functions, 80%+ lines, 80%+ statements
- **Por pasta**: src/app/api/*, src/lib/* atingem thresholds

## Próximas Etapas (Opcional)

1. **Testes de componentes React** — UI components em `src/components/ui/`
2. **E2E expandido** — mais flows do Playwright em `e2e/main.e2e.spec.ts`
3. **Performance** — query optimization tests
4. **Integration** — testes com DB real (CI/CD)

## Notas

- Testes **não precisam DB real** (Prisma mockado)
- Rodam em **Node puro** (sem NextRequest/NextResponse)
- Focam em **unit + integração**, não full end-to-end
- Existentes: `e2e/main.e2e.spec.ts` com Playwright

## Última atualização

- Data: 2026-09-15
- Total: 118 testes
- Status: ✅ Pronto para CI/CD


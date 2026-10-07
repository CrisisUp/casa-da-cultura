# 🔐 Segurança e Autorização

Documentação de políticas de segurança, autenticação e autorização da Casa da Cultura.

---

## 📋 Matriz de Permissões por Endpoint

### Artistas
| Método | Endpoint | Público | OPERATOR | ADMIN | Notas |
|--------|----------|---------|----------|-------|-------|
| GET | `/api/artistas` | ✅ Sim | - | - | Retorna apenas ATIVO |
| GET | `/api/artistas?all=true` | ❌ Não | ✅ | ✅ | Requer autenticação |
| GET | `/api/artistas/[id]` | ✅ Sim | - | - | Detalhes de 1 artista |
| POST | `/api/artistas` | ❌ Não | ✅ | ✅ | Criar novo artista |
| PUT | `/api/artistas/[id]` | ❌ Não | ✅ | ✅ | Atualizar dados |
| DELETE | `/api/artistas/[id]` | ❌ Não | ❌ | ✅ | Apenas ADMIN |
| PATCH | `/api/artistas/[id]/status` | ❌ Não | ✅ | ✅ | Ativar/inativar |
| PATCH | `/api/artistas/[id]/destaque` | ❌ Não | ✅ | ✅ | Marcar como destaque |

### Eventos
| Método | Endpoint | Público | OPERATOR | ADMIN | Notas |
|--------|----------|---------|----------|-------|-------|
| GET | `/api/eventos` | ✅ Sim | - | - | Retorna apenas ATIVO |
| GET | `/api/eventos?all=true` | ❌ Não | ✅ | ✅ | Requer autenticação |
| GET | `/api/eventos/[id]` | ✅ Sim | - | - | Detalhes de 1 evento |
| POST | `/api/eventos` | ❌ Não | ✅ | ✅ | Criar novo evento |
| PUT | `/api/eventos/[id]` | ❌ Não | ✅ | ✅ | Atualizar dados |
| DELETE | `/api/eventos/[id]` | ❌ Não | ❌ | ✅ | Apenas ADMIN |

### Depoimentos
| Método | Endpoint | Público | OPERATOR | ADMIN | Notas |
|--------|----------|---------|----------|-------|-------|
| GET | `/api/depoimentos` | ✅ Sim | - | - | Retorna apenas ATIVO |
| GET | `/api/depoimentos?all=true` | ❌ Não | ✅ | ✅ | Requer autenticação |
| GET | `/api/depoimentos/[id]` | ✅ Sim | - | - | Detalhes de 1 depoimento |
| POST | `/api/depoimentos` | ❌ Não | ✅ | ✅ | Criar novo depoimento |
| PUT | `/api/depoimentos/[id]` | ❌ Não | ✅ | ✅ | Atualizar dados |
| DELETE | `/api/depoimentos/[id]` | ❌ Não | ❌ | ✅ | Apenas ADMIN |

### Usuários (Gerenciamento)
| Método | Endpoint | Público | OPERATOR | ADMIN | Notas |
|--------|----------|---------|----------|-------|-------|
| GET | `/api/usuarios` | ❌ Não | ❌ | ✅ | Listar usuários |
| POST | `/api/usuarios` | ❌ Não | ❌ | ✅ | Criar novo usuário |
| DELETE | `/api/usuarios/[id]` | ❌ Não | ❌ | ✅ | Deletar usuário (não self) |

### Upload
| Método | Endpoint | Público | OPERATOR | ADMIN | Notas |
|--------|----------|---------|----------|-------|-------|
| POST | `/api/upload` | ✅ Sim | - | - | Com rate limiting (100/min) |

### Estatísticas
| Método | Endpoint | Público | OPERATOR | ADMIN | Notas |
|--------|----------|---------|----------|-------|-------|
| GET | `/api/stats` | ❌ Não | ✅ | ✅ | Dashboard stats |

---

## 🔑 Autenticação

- **Método:** NextAuth v5 (Auth.js)
- **Estratégia:** JWT + Credentials Provider
- **Roles:** `ADMIN` e `OPERATOR`

### Verificação Consistente

Todos os endpoints protegidos usam:

```typescript
const session = await auth();
if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "OPERATOR")) {
  return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
}

// Para endpoints ADMIN-only:
if (!session || session.user?.role !== "ADMIN") {
  return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
}
```

**Nunca use:**
- ❌ `getToken()` (inconsistente com session)
- ❌ String comparisons case-insensitive (`toLowerCase()` vs uppercase roles)
- ❌ Verificações diferentes em endpoints similares

---

## 📤 Upload de Arquivos

### Whitelist de Tipos
- ✅ **Permitido:** `JPG`, `PNG`, `WebP`, `GIF`
- ❌ **Bloqueado:** Qualquer outra extensão (`.ts`, `.js`, `.sh`, `.exe`, etc.)

### Validação
1. Valida MIME type contra whitelist
2. Valida extensão do arquivo contra MIME type
3. Rejeita se houver mismatch (arquivo spoofado)
4. Gera nome com UUID + extensão validada

### Rate Limiting
- **Limite:** 100 requisições por minuto, por IP
- **Extração de IP:** `x-forwarded-for` → `x-real-ip` → `unknown`
- **Resposta:** `429 Too Many Requests`

---

## 🔍 Auditoria

### Logs Permitidos
- ✅ Criação/atualização/deleção de registros (com ID)
- ✅ Upload de arquivos (nome, tamanho, MIME type)
- ✅ Erros de acesso negado (sem detalhes sensíveis)

### Logs Proibidos
- ❌ Senhas (em qualquer forma)
- ❌ Dados sensíveis (emails, CPF, etc.)
- ❌ Tokens ou secrets
- ❌ Debug logs em produção (emojis, valores brutos)

---

## 🛡️ Boas Práticas

### Ao criar novo endpoint:

1. **Defina a permissão na matriz** (pública vs OPERATOR vs ADMIN)
2. **Use `auth()`** para verificar autenticação
3. **Valide inputs** com Zod schemas
4. **Retorne erros padronizados:**
   - `400` - Dados inválidos
   - `403` - Acesso negado
   - `404` - Recurso não encontrado
   - `413` - Arquivo muito grande
   - `415` - Tipo de arquivo não permitido
   - `429` - Rate limit excedido
   - `500` - Erro servidor
5. **Log apenas o necessário** (sem dados sensíveis)
6. **Teste acesso negado** antes de commitar

---

**Última atualização:** Outubro 2026

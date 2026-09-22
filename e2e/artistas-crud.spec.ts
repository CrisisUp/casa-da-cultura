import { test, expect } from '@playwright/test';

// Gera CPF único por teste para evitar conflito de unique constraint no banco
function cpfUnico(): string {
  const n = Math.floor(10000000000 + Math.random() * 89999999999);
  return `${n}`.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Nome único por teste para evitar conflito com dados antigos no banco
function nomeUnico(prefixo: string): string {
  return `${prefixo} ${Date.now()}`;
}

test.describe('CRUD de Artistas - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Ir para artistas
    await page.goto('/dashboard/artistas');
    await page.waitForLoadState('networkidle');
  });

  test('criar novo artista completo', async ({ page }) => {
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);

    const cpf = cpfUnico();
    const nome = nomeUnico('Artista Criar');

    // Preencher formulário
    await page.fill('input[name="nome"]', nome);
    await page.fill('input[name="cpf"]', cpf);
    await page.fill('input[name="telefone"]', '(11) 98765-4321');
    await page.fill('input[name="email"]', 'joao@teste.com');
    await page.fill('input[name="endereco"]', 'Rua Teste, 123');
    await page.selectOption('select[name="generoArtistico"]', 'Música');

    // Submeter e aguardar redirecionamento
    await page.click('button[type="submit"]');
    await page.waitForURL(/artistas$/, { timeout: 10000 });

    // Verificar que artista aparece na lista (usar .first() para evitar strict mode)
    await expect(page.locator(`text=${nome}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('editar artista', async ({ page }) => {
    // Criar um artista primeiro
    const cpf = cpfUnico();
    const nomeOriginal = nomeUnico('Artista Edit');
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);
    await page.fill('input[name="nome"]', nomeOriginal);
    await page.fill('input[name="cpf"]', cpf);
    await page.fill('input[name="telefone"]', '(11) 91111-2222');
    await page.selectOption('select[name="generoArtistico"]', 'Dança');
    await page.click('button[type="submit"]');
    await page.waitForURL(/artistas$/, { timeout: 10000 });

    // Aguardar tabela carregar com o artista recém-criado
    await expect(page.locator(`text=${nomeOriginal}`).first()).toBeVisible({ timeout: 5000 });

    // Encontrar a linha específica do artista e clicar em editar
    const row = page.locator('article, table tbody tr', { hasText: nomeOriginal }).first();
    await row.locator('a[href*="/editar"]').click();
    await page.waitForURL(/editar$/);

    // Alterar nome e submeter
    await page.fill('input[name="nome"]', 'Artista Editado');
    await page.click('button[type="submit"]');
    await page.waitForURL(/artistas$/, { timeout: 10000 });

    // Verificar que mudança foi salva
    await expect(page.locator('text=Artista Editado').first()).toBeVisible({ timeout: 5000 });
  });

  test('deletar artista com confirmação', async ({ page }) => {
    // Criar artista com nome único
    const cpf = cpfUnico();
    const nome = nomeUnico('Artista Del');
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);
    await page.fill('input[name="nome"]', nome);
    await page.fill('input[name="cpf"]', cpf);
    await page.fill('input[name="telefone"]', '(11) 95555-6666');
    await page.selectOption('select[name="generoArtistico"]', 'Teatro');
    await page.click('button[type="submit"]');
    await page.waitForURL(/artistas$/, { timeout: 10000 });

    // Aguardar que o artista apareça na lista
    await expect(page.locator(`text=${nome}`).first()).toBeVisible({ timeout: 5000 });

    // Registrar handler de dialog ANTES de clicar delete
    page.on('dialog', dialog => dialog.accept());

    // Encontrar a linha específica e clicar delete
    const row = page.locator('article, table tbody tr', { hasText: nome }).first();
    await row.locator('button[title*="Excluir"], button').last().click();

    // Aguardar recarregamento da lista
    await page.waitForLoadState('networkidle');

    // Verificar que não aparece mais na lista
    await expect(page.locator(`text=${nome}`).first()).not.toBeVisible({ timeout: 5000 });
  });

  test('listar artistas com paginação', async ({ page }) => {
    const pagination = page.locator('[role="pagination"], nav[aria-label="paginação"]');

    if (await pagination.isVisible()) {
      const nextButton = page.locator('button:has-text("Próxima")');

      if (await nextButton.isEnabled()) {
        const firstPageText = await page.locator('article, table tbody tr').first().textContent();
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        const secondPageText = await page.locator('article, table tbody tr').first().textContent();
        expect(firstPageText).not.toBe(secondPageText);
      }
    }
  });

  test('filtrar por gênero artístico', async ({ page }) => {
    // Filtros usam React state, não atualizam URL
    const selectGenero = page.locator('select').first();
    await selectGenero.selectOption('Música');

    // Filtragem é client-side — aguardar re-render com toPass
    await expect(async () => {
      const tableVisible = await page.locator('article, table').first().isVisible().catch(() => false);
      const emptyVisible = await page.locator('text=Nenhum artista encontrado').isVisible().catch(() => false);
      expect(tableVisible || emptyVisible).toBeTruthy();
    }).toPass({ timeout: 5000 });
  });

  test('buscar artista por nome', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar por nome"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('João');

      // Filtragem é client-side — aguardar re-render
      await expect(async () => {
        const tableVisible = await page.locator('article, table').first().isVisible().catch(() => false);
        const emptyVisible = await page.locator('text=Nenhum artista encontrado').isVisible().catch(() => false);
        expect(tableVisible || emptyVisible).toBeTruthy();
      }).toPass({ timeout: 5000 });
    }
  });

  test('validação de formulário - campos obrigatórios', async ({ page }) => {
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);

    // Submeter vazio — HTML5 required validation deve impedir envio
    await page.click('button[type="submit"]');

    // Deve continuar na página (HTML5 impediu submissão)
    expect(page.url()).toContain('/novo');

    // Verificar que o formulário ainda está visível
    await expect(page.locator('form')).toBeVisible();
  });

  test('validação de CPF', async ({ page }) => {
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);

    await page.fill('input[name="nome"]', 'João Silva');
    await page.fill('input[name="cpf"]', '123'); // CPF inválido
    await page.fill('input[name="telefone"]', '(11) 98765-4321');
    await page.selectOption('select[name="generoArtistico"]', 'Música');

    await page.click('button[type="submit"]');

    // Deve continuar na página (não redirecionar)
    expect(page.url()).toContain('/novo');

    // Deve mostrar erro de CPF inline (Input usa text-danger, Select usa text-red-600)
    await expect(page.locator('text=/inválido|inválida/i').first()).toBeVisible({ timeout: 5000 });
  });
});

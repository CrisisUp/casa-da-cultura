import { expect, test } from '@playwright/test';

// Gera um CPF válido com dígitos verificadores calculados para passar na validação do Zod/backend
function gerarCpfValido(): string {
  const rand = () => Math.floor(Math.random() * 9);
  const n = Array.from({ length: 9 }, rand);

  let d1 = n.reduce((total, num, index) => total + num * (10 - index), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;

  let d2 = n.reduce((total, num, index) => total + num * (11 - index), 0) + d1 * 2;
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;

  const cpfRaw = `${n.join('')}${d1}${d2}`;
  return cpfRaw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Nome único por teste para evitar conflito com dados no banco
function nomeUnico(prefixo: string): string {
  return `${prefixo} ${Date.now()}`;
}

test.describe('CRUD de Artistas - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Aguarda o login e redirecionamento para o dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    await page.goto('/dashboard/artistas');
    await page.waitForLoadState('networkidle');
  });

  test('criar novo artista completo', async ({ page }) => {
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);

    const cpf = gerarCpfValido();
    const nome = nomeUnico('Artista Criar');

    // Preencher formulário
    await page.fill('input[name="nome"]', nome);
    await page.fill('input[name="cpf"]', cpf);
    await page.fill('input[name="telefone"]', '(11) 98765-4321');
    await page.fill('input[name="email"]', `artista.${Date.now()}@teste.com`);
    await page.fill('input[name="endereco"]', 'Rua Teste, 123');
    await page.selectOption('select[name="generoArtistico"]', 'Música');

    // Submeter e aguardar redirecionamento para a listagem
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard\/artistas(\?.*)?$/, { timeout: 15000 });

    // Verificar que o artista aparece na lista
    await expect(page.locator(`text=${nome}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('editar artista', async ({ page }) => {
    // 1. Criar um artista primeiro com todos os dados válidos
    const cpf = gerarCpfValido();
    const nomeOriginal = nomeUnico('Artista Edit');
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);
    await page.fill('input[name="nome"]', nomeOriginal);
    await page.fill('input[name="cpf"]', cpf);
    await page.fill('input[name="telefone"]', '(11) 91111-2222');
    await page.fill('input[name="email"]', `edit.${Date.now()}@teste.com`);
    await page.fill('input[name="endereco"]', 'Rua Teste, 456');
    await page.selectOption('select[name="generoArtistico"]', 'Dança');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard\/artistas(\?.*)?$/, { timeout: 15000 });

    // Aguardar tabela carregar com o artista recém-criado
    await expect(page.locator(`text=${nomeOriginal}`).first()).toBeVisible({ timeout: 10000 });

    // 2. Encontrar a linha ou card do artista e clicar em editar
    const row = page.locator('article, table tbody tr', { hasText: nomeOriginal }).first();
    await row.locator('a[href*="/editar"]').click();
    await page.waitForURL(/editar$/);

    // 3. Alterar nome e submeter
    const nomeAtualizado = nomeUnico('Artista Atualizado');
    await page.fill('input[name="nome"]', nomeAtualizado);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard\/artistas(\?.*)?$/, { timeout: 15000 });

    // Verificar que a mudança foi salva
    await expect(page.locator(`text=${nomeAtualizado}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('deletar artista com confirmação', async ({ page }) => {
    const cpf = gerarCpfValido();
    const nome = nomeUnico('Artista Del');
    await page.click('a[href="/dashboard/artistas/novo"]');
    await page.waitForURL(/novo$/);
    await page.fill('input[name="nome"]', nome);
    await page.fill('input[name="cpf"]', cpf);
    await page.fill('input[name="telefone"]', '(11) 95555-6666');
    await page.fill('input[name="email"]', `del.${Date.now()}@teste.com`);
    await page.fill('input[name="endereco"]', 'Rua Teste, 789');
    await page.selectOption('select[name="generoArtistico"]', 'Teatro');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard\/artistas(\?.*)?$/, { timeout: 15000 });

    const card = page.locator('article, table tbody tr', { hasText: nome }).first();
    await expect(card).toBeVisible({ timeout: 10000 });

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    const deleteBtn = card.locator(`button[aria-label="Excluir ${nome}"], button:has-text("Excluir")`).first();

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/api/artistas') && res.request().method() === 'DELETE',
        { timeout: 10000 }
      ),
      deleteBtn.click(),
    ]);

    await page.waitForTimeout(500);
    await page.goto('/dashboard/artistas');
    await page.waitForLoadState('networkidle');

    await expect(page.locator(`text=${nome}`)).toHaveCount(0, { timeout: 10000 });
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
    const selectGenero = page.locator('select').first();
    await selectGenero.selectOption('Música');

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

    await page.click('button[type="submit"]');

    expect(page.url()).toContain('/novo');
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

    expect(page.url()).toContain('/novo');
    await expect(page.locator('text=/inválido|inválida/i').first()).toBeVisible({ timeout: 5000 });
  });
});
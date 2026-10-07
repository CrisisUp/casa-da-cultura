import { expect, test } from '@playwright/test';

test.describe('CRUD de Depoimentos e Eventos', () => {
  test.beforeEach(async ({ page }) => {
    // Garante que o cliente e cookies/CSRF foram hidratados antes do envio
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Aceita qualquer variação da rota /dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  });

  test('criar novo depoimento', async ({ page }) => {
    await page.goto('/dashboard/depoimentos/novo');
    await page.waitForLoadState('networkidle');

    const nomeAutor = `Maria Silva ${Date.now()}`;

    // Preenche autor
    const inputAutor = page.locator('input[name="autor"], input[name="nome"]').first();
    await inputAutor.fill(nomeAutor);

    // Preenche texto / depoimento
    const inputTexto = page.locator('textarea[name="texto"], textarea[name="conteudo"]').first();
    await inputTexto.fill('Excelente centro cultural e apoio aos artistas!');

    // Campo cargo / ocupação (opcional)
    const inputCargo = page.locator('input[name="cargo"], input[name="ocupacao"]').first();
    if (await inputCargo.isVisible().catch(() => false)) {
      await inputCargo.fill('Frequentadora');
    }

    // Select de artista vinculado (caso exista e seja obrigatório)
    const selectArtista = page.locator('select[name="artistaId"], select').first();
    if (await selectArtista.isVisible().catch(() => false)) {
      const options = await selectArtista.locator('option').all();
      if (options.length > 1) {
        await selectArtista.selectOption({ index: 1 });
      }
    }

    // Nota / avaliação (caso exista)
    const inputNota = page.locator('input[name="nota"], input[name="avaliacao"]').first();
    if (await inputNota.isVisible().catch(() => false)) {
      await inputNota.fill('5');
    }

    // Submete e intercepta a requisição da API
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/depoimentos') && resp.request().method() === 'POST',
      { timeout: 10000 }
    ).catch(() => null);

    await page.click('button[type="submit"]');
    await responsePromise;

    // Aguarda o retorno para a listagem
    await page.waitForURL(/\/dashboard\/depoimentos|\/depoimentos/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Caso a listagem precise de refresh para refletir a nova inserção
    if (!(await page.locator(`text=${nomeAutor}`).first().isVisible().catch(() => false))) {
      await page.goto('/dashboard/depoimentos');
      await page.waitForLoadState('networkidle');
    }

    // Verifica que o depoimento recém-criado está visível
    await expect(page.locator(`text=${nomeAutor}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('editar depoimento', async ({ page }) => {
    await page.goto('/dashboard/depoimentos');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('a[href*="/editar"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForURL(/editar$/);

      await page.fill('textarea[name="texto"], textarea[name="conteudo"]', 'Texto completamente novo e atualizado.');
      await page.click('button[type="submit"]');
      await page.waitForURL(/depoimentos$/, { timeout: 10000 });

      await expect(page.locator('text=/atualizado|Atualizado/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('deletar depoimento', async ({ page }) => {
    await page.goto('/dashboard/depoimentos');
    await page.waitForLoadState('networkidle');

    page.on('dialog', (dialog) => dialog.accept());

    const deleteButton = page.locator('table tbody tr button, article button').last();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test.describe('Eventos', () => {
    test('criar novo evento', async ({ page }) => {
      await page.goto('/dashboard/eventos');
      await page.waitForLoadState('networkidle');

      await page.locator('a[href="/dashboard/eventos/novo"]').click();
      await page.waitForURL(/novo$/);

      const tituloEvento = `Apresentação ao Vivo ${Date.now()}`;

      await page.fill('input[name="titulo"]', tituloEvento);
      await page.fill('textarea[name="descricao"]', 'Apresentação de artistas locais');
      await page.fill('input[name="data"]', '2026-10-20');
      await page.fill('input[name="hora"]', '19:00');
      await page.fill('input[name="local"]', 'Teatro Municipal');
      await page.selectOption('select[name="tipo"]', 'Música');

      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes('/api/eventos') && resp.request().method() === 'POST',
        { timeout: 10000 }
      );
      await page.click('button[type="submit"]');
      const response = await responsePromise;

      if (!response.ok()) {
        const body = await response.json().catch(() => ({}));
        throw new Error(`API retornou ${response.status()}: ${JSON.stringify(body)}`);
      }

      await page.waitForURL(/eventos$/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      await expect(page.locator(`text=${tituloEvento}`).first()).toBeVisible({ timeout: 5000 });
    });

    test('editar evento', async ({ page }) => {
      await page.goto('/dashboard/eventos');
      await page.waitForLoadState('networkidle');

      const editButton = page.locator('a[href*="/editar"]').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForURL(/editar$/);

        await page.fill('input[name="hora"]', '20:00');
        await page.click('button[type="submit"]');
        await page.waitForURL(/eventos$/, { timeout: 10000 });

        await expect(page.locator('text=/atualizado|Atualizado/i').first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('deletar evento', async ({ page }) => {
      await page.goto('/dashboard/eventos');
      await page.waitForLoadState('networkidle');

      page.on('dialog', (dialog) => dialog.accept());

      const deleteButton = page.locator('table tbody tr button, article button').last();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForLoadState('networkidle');
      }
    });
  });
});
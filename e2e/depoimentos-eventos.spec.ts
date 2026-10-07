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

    // Listener para erros do console
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'log') {
        console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
      }
    });

    // Preenche nome
    await page.fill('input[name="nome"]', nomeAutor);

    // Seleciona primeira opção válida do select (index 1 pula "Selecione...")
    await page.selectOption('select[name="genero"]', { index: 1 });

    // Preenche texto com tamanho suficiente (schema exige mín 10 chars)
    await page.fill('textarea[name="texto"]', 'Excelente centro cultural e apoio fundamental aos artistas locais.');

    // Preenche avatar (iniciais de 2 caracteres)
    await page.fill('input[name="avatar"]', 'MS');

    // Dispara o submit e aguarda a resposta da API com timeout maior
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/depoimentos') && resp.request().method() === 'POST',
      { timeout: 20000 }
    ).catch(() => null);

    console.log('Clicando no botão...');
    await page.click('button[type="submit"]');

    console.log('Aguardando POST...');
    const response = await responsePromise;

    if (!response) {
      throw new Error('POST /api/depoimentos não foi disparado. Verifique erros de validação no console acima.');
    }

    expect(response.status()).toBeLessThan(400);

    // Aguarda navegar para a lista
    await page.waitForURL('**/dashboard/depoimentos', { timeout: 20000 });
    await page.waitForLoadState('networkidle');

    // Aguarda um pouco para o useEffect completar
    await page.waitForTimeout(1000);

    // Valida que o nome aparece na tela
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

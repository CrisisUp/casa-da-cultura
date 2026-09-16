import { test, expect } from '@playwright/test';

test.describe('CRUD de Depoimentos e Eventos', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test.describe('Depoimentos', () => {
    test('criar novo depoimento', async ({ page }) => {
      await page.goto('/dashboard/depoimentos');
      await page.locator('a[href="/dashboard/depoimentos/novo"]').click();
      await page.waitForURL(/novo$/);

      await page.fill('input[name="nome"]', 'Maria Silva');
      await page.selectOption('select[name="genero"]', 'Dança');
      await page.fill('textarea[name="texto"]', 'Este programa mudou completamente minha vida profissional e pessoal.');

      await page.click('button[type="submit"]');
      await page.waitForURL(/depoimentos$/);

      // Verificar que aparece na lista (usar .first() para evitar strict mode)
      await expect(page.locator('text=Maria Silva').first()).toBeVisible({ timeout: 5000 });
    });

    test('editar depoimento', async ({ page }) => {
      await page.goto('/dashboard/depoimentos');

      const editButton = page.locator('a[href*="/editar"]').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForURL(/editar$/);

        await page.fill('textarea[name="texto"]', 'Texto completamente novo e atualizado.');
        await page.click('button[type="submit"]');
        await page.waitForURL(/depoimentos$/);

        await expect(page.locator('text=/atualizado|Atualizado/i').first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('deletar depoimento', async ({ page }) => {
      await page.goto('/dashboard/depoimentos');

      page.on('dialog', dialog => dialog.accept());

      const deleteButton = page.locator('table tbody tr button').last();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('Eventos', () => {
    test('criar novo evento', async ({ page }) => {
      await page.goto('/dashboard/eventos');
      await page.locator('a[href="/dashboard/eventos/novo"]').click();
      await page.waitForURL(/novo$/);

      await page.fill('input[name="titulo"]', 'Apresentação de Música ao Vivo');
      await page.fill('textarea[name="descricao"]', 'Apresentação de artistas locais');
      await page.fill('input[name="data"]', '2026-10-20');
      await page.fill('input[name="hora"]', '19:00');
      await page.fill('input[name="local"]', 'Teatro Municipal');
      await page.selectOption('select[name="tipo"]', 'Música');

      // Interceptar resposta da API para diagnóstico
      const responsePromise = page.waitForResponse(
        resp => resp.url().includes('/api/eventos') && resp.request().method() === 'POST',
        { timeout: 10000 }
      );
      await page.click('button[type="submit"]');
      const response = await responsePromise;

      // Se API retornou erro, aguardar e falhar com mensagem descritiva
      if (!response.ok()) {
        const body = await response.json().catch(() => ({}));
        throw new Error(`API retornou ${response.status()}: ${JSON.stringify(body)}`);
      }

      await page.waitForURL(/eventos$/, { timeout: 10000 });

      // Verificar que aparece na lista
      await expect(page.locator('text=Apresentação de Música ao Vivo').first()).toBeVisible({ timeout: 5000 });
    });

    test('editar evento', async ({ page }) => {
      await page.goto('/dashboard/eventos');

      const editButton = page.locator('a[href*="/editar"]').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForURL(/editar$/);

        await page.fill('input[name="hora"]', '20:00');
        await page.click('button[type="submit"]');
        await page.waitForURL(/eventos$/);

        await expect(page.locator('text=/atualizado|Atualizado/i').first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('deletar evento', async ({ page }) => {
      await page.goto('/dashboard/eventos');

      page.on('dialog', dialog => dialog.accept());

      const deleteButton = page.locator('table tbody tr button').last();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForLoadState('networkidle');
      }
    });
  });
});

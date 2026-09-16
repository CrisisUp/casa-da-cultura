import { test, expect } from '@playwright/test';

test.describe('API Auth', () => {
  test('acesso à API sem autenticação retorna erro 401', async ({ page }) => {
    const response = await page.request.get('/api/artistas');
    expect(response.status()).toBe(401);
    const json = await response.json();
    expect(json.error).toBeDefined();
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('dashboard carrega corretamente', async ({ page }) => {
    await page.goto('/dashboard');
    // Header mostra "Sistema de Cadastro"
    await expect(page.locator('text=Sistema de Cadastro')).toBeVisible();
  });

  test('menu de navegação funciona', async ({ page }) => {
    // Abrir sidebar (drawer)
    await page.click('button[aria-label="Abrir menu"]');

    // Navegar para artistas
    await page.locator('a[href="/dashboard/artistas"]').first().click();
    await page.waitForURL(/artistas$/);
    expect(page.url()).toContain('/artistas');

    // Abrir sidebar novamente
    await page.click('button[aria-label="Abrir menu"]');

    // Navegar para eventos
    await page.locator('a[href="/dashboard/eventos"]').first().click();
    await page.waitForURL(/eventos$/);
    expect(page.url()).toContain('/eventos');
  });
});

test.describe('Upload de Arquivo', () => {
  test('input de arquivo existe na página de novo artista', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/artistas/novo');
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });
});

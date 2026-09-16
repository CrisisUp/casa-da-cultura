import { test, expect } from '@playwright/test';

test.describe('Autenticação - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login com credenciais válidas', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    expect(page.url()).toContain('/dashboard');

    // Verificar que está autenticado
    await expect(page.locator('text=Sair do sistema')).toBeVisible({ timeout: 5000 });
  });

  test('login com credenciais inválidas mostra erro', async ({ page }) => {
    await page.fill('input[type="email"]', 'wrong@test.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=/Email ou senha inválidos/i')).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('logout retorna ao login', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Abrir sidebar e clicar logout
    await page.click('button[aria-label="Abrir menu"]');
    await page.click('text=Sair do sistema');

    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('acesso a /dashboard sem auth redireciona para /login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('sessão persiste ao navegar', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@casa.gov.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Abrir sidebar (drawer) antes de navegar
    await page.click('button[aria-label="Abrir menu"]');

    // Navegar para artistas
    await page.locator('a[href="/dashboard/artistas"]').first().click();
    await page.waitForURL(/artistas$/);

    // Abrir sidebar novamente
    await page.click('button[aria-label="Abrir menu"]');

    // Navegar para depoimentos
    await page.locator('a[href="/dashboard/depoimentos"]').first().click();
    await page.waitForURL(/depoimentos$/);

    // Ainda está logado
    expect(page.url()).toContain('/dashboard');
  });
});

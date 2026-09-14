import { test, expect } from '@playwright/test';

test.describe('Framework smoke example', () => {
  test('opens configured base URL', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*/);
  });
});

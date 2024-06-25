import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");  
    await expect(page.locator(".login_logo")).toHaveText("Swag Labs"); 
    await page.locator("#user-name").fill("standard_user");
    await page.locator("#password").fill("secret_sauce");
    await expect(page.locator("#login-button")).toHaveText("Login"); 
    await page.locator("#login-button").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

test('purchase test', async ({ page }) => {
    await expect (page.getByRole('img', { name: 'Sauce Labs Fleece Jacket' })).toBeVisible();
    const imageSrc = await page.getByRole('img', { name: 'Sauce Labs Fleece Jacket' }).getAttribute('src');
    expect(imageSrc).toContain('/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg');
});
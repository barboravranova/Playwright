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
    await expect(page.getByRole('img', { name: 'Sauce Labs Fleece Jacket' })).toBeVisible();
    const imageSrc = await page.getByRole('img', { name: 'Sauce Labs Fleece Jacket' }).getAttribute('src');
    await expect(imageSrc).toContain('/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg');

    await expect(page.locator("#add-to-cart-sauce-labs-fleece-jacket")).toHaveText("Add to cart");
    await page.locator("#add-to-cart-sauce-labs-fleece-jacket").click();
    await expect(page.locator("#remove-sauce-labs-fleece-jacket")).toHaveText("Remove");

    await page.locator('[data-test="shopping-cart-badge"]').click();

    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');

    await expect(page.locator('.inventory_item_name')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Fleece Jacket');

    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    await page.locator('[data-test="firstName"]').fill("Jan");
    await page.locator('[data-test="lastName"]').fill("Marek");
    await page.locator('[data-test="postalCode"]').fill("12345");

    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
});
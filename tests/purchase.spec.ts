import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import { InventoryPage } from './pages/invertoryPage';
import { CartPage } from './pages/cartPage';
import { CheckoutPage } from './pages/checkoutPage';


const users = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'locked_out_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' },
    { username: 'performance_glitch_user', password: 'secret_sauce' },
];

users.forEach(user => {
    test.describe(`Test with user: ${user.username}`, () => {
        test.beforeEach(async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goTo();
            await loginPage.login(user.username, user.password);
        });

        test('purchase test', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.verifyProductImage()

            const productPrice = inventoryPage.verifyProductImage();
            await inventoryPage.addItemToCart();

            await inventoryPage.removeItem();

            await inventoryPage.addItemToCart();
            await inventoryPage.verifyCartBadge("1");
            await inventoryPage.goToCart();

            const cartPage = new CartPage(page);
            await cartPage.verifyCartItem(1, 'Sauce Labs Fleece Jacket');

            cartPage.goToCheckout();

            const checkoutPage = new CheckoutPage(page);

            checkoutPage.verifyOnCheckoutPage();
            checkoutPage.fillInformationAndContinue("Jan", "Test", "12345");

            await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
            await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');

            /*const totalPriceText = await page.locator('[data-test="subtotal-label"]').textContent();
            if (totalPriceText === null) {
                throw new Error('Součet ceny produktů nebyl nalezen.');
            }
            const totalPrice = parseFloat(totalPriceText.replace('Item total: $', ''));
            expect(totalPrice).toBe(productPrice);*/

            const finishButton = page.getByRole('button', { name: 'Finish' });
            await expect(finishButton).toHaveText('Finish');
            await finishButton.click();

            await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
            await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
            await expect(page.getByText('Thank you for your order!')).toBeVisible();

            await page.getByRole('button', { name: 'Open Menu' }).click()
            await expect(page.getByRole('navigation')).toBeVisible();
            await page.getByRole('link', { name: 'Logout' }).click();

            await expect(page).toHaveURL('https://www.saucedemo.com/');
            await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
        });
    });
});
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';


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
            loginPage.goto();
            loginPage.login(user.username, user.password);
        });

        test('purchase test', async ({ page }) => {
            const productImage = page.getByRole('img', { name: 'Sauce Labs Fleece Jacket' });
            await expect(productImage).toBeVisible();
            const productImageSrc = await productImage.getAttribute('src');
            await expect(productImageSrc).toContain('/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg');

            const productPriceText = await page.locator('.inventory_item:has-text("Sauce Labs Fleece Jacket") [data-test="inventory-item-price"]').textContent();
            if (productPriceText === null) {
                throw new Error('Cena produktu nebyla nalezena.');
            }
            const productPrice = parseFloat(productPriceText.replace('$', ''));

            const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
            await expect(addToCartButton).toHaveText("Add to cart");
            await addToCartButton.click();

            const removeButton = page.locator('[data-test="remove-sauce-labs-fleece-jacket"]');
            await expect(removeButton).toHaveText("Remove");
            await removeButton.click();
            await expect(addToCartButton).toHaveText("Add to cart");

            await addToCartButton.click();

            const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
            await expect(cartBadge).toHaveText("1");
            await cartBadge.click();

            await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
            await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');

            const cartItemName = page.locator('[data-test="inventory-item-name"]')
            await expect(cartItemName).toHaveCount(1);
            await expect(cartItemName).toHaveText('Sauce Labs Fleece Jacket');

            const checkoutButton = page.getByRole('button', { name: 'Checkout' });
            await expect(checkoutButton).toHaveText('Checkout');
            await checkoutButton.click();

            await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
            await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

            await page.getByPlaceholder('First Name').fill('Jan');
            await page.getByPlaceholder('Last Name').fill('Marek');
            await page.getByPlaceholder('Zip/Postal Code').fill('12345');

            const continueButton = page.getByRole('button', { name: 'Continue' });
            await expect(continueButton).toHaveText('Continue');
            await continueButton.click();

            await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
            await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');

            const totalPriceText = await page.locator('[data-test="subtotal-label"]').textContent();
            if (totalPriceText === null) {
                throw new Error('Součet ceny produktů nebyl nalezen.');
            }
            const totalPrice = parseFloat(totalPriceText.replace('Item total: $', ''));
            expect(totalPrice).toBe(productPrice);

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
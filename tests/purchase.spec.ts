import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import { InventoryPage } from './pages/invertoryPage';
import { CartPage } from './pages/cartPage';
import { CheckoutStepOnePage } from './pages/checkoutStepOnePage';
import { CheckoutStepTwoPage } from './pages/checkoutStepTwoPage';
import { CheckoutCompletePage } from './pages/checkoutCompletePage';


const users = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'error_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' },
    { username: 'performance_glitch_user', password: 'secret_sauce' },
];

users.forEach(user => {
    test.describe(`Test with user: ${user.username}`, () => {
        test.beforeEach(async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goTo();
            await loginPage.verifyLoginPage();
            await loginPage.login(user.username, user.password);
        });

        test('purchase test', async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.verifyInvertoryPage();
            await inventoryPage.verifyProductImage();
            const productPrice = await inventoryPage.getProductPrice();
            await inventoryPage.addItemToCart();
            await inventoryPage.removeItem();
            await inventoryPage.addItemToCart();
            await inventoryPage.verifyCartBadge('1');
            await inventoryPage.goToCart();

            const cartPage = new CartPage(page);
            await cartPage.verifyCartPage();
            await cartPage.verifyCartItem(1, 'Sauce Labs Fleece Jacket');
            await cartPage.goToCheckout();

            const checkoutStepOnePage = new CheckoutStepOnePage(page);
            await checkoutStepOnePage.verifyCheckoutStepOnePage();
            await checkoutStepOnePage.fillInformationAndContinue('Jan', 'Test', '12345');

            const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
            await checkoutStepTwoPage.verifyCheckoutStepTwoPage();
            const totalPrice = await checkoutStepTwoPage.getTotalPrice();
            expect(totalPrice).toBe(productPrice);
            await checkoutStepTwoPage.finishCheckout();

            const checkoutCompletePage = new CheckoutCompletePage(page);
            await checkoutCompletePage.verifyCheckoutCompletePage();
            await checkoutCompletePage.openMenu();
            await checkoutCompletePage.logout();        
            
            const loginPage = new LoginPage(page);
            await loginPage.verifyLoginPage();
        });
    });
});
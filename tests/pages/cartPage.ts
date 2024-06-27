import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItemName: Locator;
    readonly checkoutButton: Locator;
    private title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItemName = page.locator('[data-test="inventory-item-name"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async verifyOnCartPage() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
        await expect(this.title).toHaveText('Your Cart');
    }

    async verifyCartItem(expectedItemsNumber: number, expectedItemName: string)
    {
        await expect(this.cartItemName).toHaveCount(expectedItemsNumber);
        await expect(this.cartItemName).toHaveText(expectedItemName);
    }

    async goToCheckout() {
        await this.checkoutButton.click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    }

}
import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItemName: Locator;
    readonly checkoutButton: Locator;
    readonly  title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.cartItemName = page.locator('[data-test="inventory-item-name"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async verifyCartPage(): Promise<void> {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
        await expect(this.title).toHaveText('Your Cart');
    }

    async verifyCartItem(expectedItemsNumber: number, expectedItemName: string): Promise<void> {
        await expect(this.cartItemName).toHaveCount(expectedItemsNumber);
        await expect(this.cartItemName).toHaveText(expectedItemName);
    }

    async goToCheckout(): Promise<void> {
        await this.checkoutButton.click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    }

}
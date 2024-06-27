import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutStepTwoPage {
    private page: Page;
    private finishButton: Locator;
    private totalPriceLabel: Locator;
    private title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.totalPriceLabel = page.locator('[data-test="subtotal-label"]');
    }

    async verifyCheckoutStepTwoPage(): Promise<void> {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        await expect(this.title).toHaveText('Checkout: Overview');
    }

    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    async getTotalPrice(): Promise<number> {
        const totalPriceText = await this.totalPriceLabel.textContent();
        if (totalPriceText === null) {
            throw new Error('Součet ceny produktů nebyl nalezen.');
        }
        return parseFloat(totalPriceText.replace('Item total: $', ''));
    }
}

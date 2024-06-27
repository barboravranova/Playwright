import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
    readonly  page: Page;
    readonly  openMenuButton: Locator;
    readonly  navigationMenu: Locator;
    readonly  logoutLink: Locator;
    readonly  title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
        this.navigationMenu = page.getByRole('navigation');
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
    }

    async verifyCheckoutCompletePage(): Promise<void>  {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        await expect(this.title).toHaveText('Checkout: Complete!');
        await expect(this.page.getByText('Thank you for your order!')).toBeVisible();
    }

    async openMenu(): Promise<void> {
        await this.openMenuButton.click();
        await expect(this.navigationMenu).toBeVisible();
    }

    async logout(): Promise<void> {
        await this.logoutLink.click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }

}
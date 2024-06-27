import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goTo(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/');
        await expect(this.page.locator('.login_logo')).toHaveText('Swag Labs');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }
}
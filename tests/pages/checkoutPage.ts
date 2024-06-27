import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
    private page: Page;
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private postalCodeInput: Locator;
    private continueButton: Locator;
    private title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.title = page.locator('[data-test="title"]');
    }

    async verifyOnCheckoutPage() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        await expect(this.title).toHaveText('Checkout: Your Information');
    }

    async fillInformationAndContinue(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        await expect(this.page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
    }
}
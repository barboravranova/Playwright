import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly productImage: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly cartBadge: Locator;
    readonly removeButton: Locator;
    private title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productImage = page.getByRole('img', { name: 'Sauce Labs Fleece Jacket' });
        this.productPrice = page.locator('.inventory_item:has-text("Sauce Labs Fleece Jacket") [data-test="inventory-item-price"]');
        this.addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.removeButton = page.locator('[data-test="remove-sauce-labs-fleece-jacket"]');

    }

    async verifyOnInvertoryPage() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(this.title).toHaveText('Products');
    }

    async verifyProductImage() {
        await expect(this.productImage).toBeVisible();
        const productImageSrc = await this.productImage.getAttribute('src');
        expect(productImageSrc).toContain('/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg');
    }

    async getProductPrice() {
        const priceText = await this.productPrice.textContent();
        if (priceText === null) {
            throw new Error('Cena produktu nebyla nalezena.');
        }
        return parseFloat(priceText.replace('$', ''));
    }

    async addItemToCart() {
        await expect(this.addToCartButton).toHaveText('Add to cart');
        await this.addToCartButton.click();
        await expect(this.removeButton).toHaveText("Remove");
    }

    async removeItem()
    {
        await this.removeButton.click();
        await expect(this.addToCartButton).toHaveText("Add to cart");
    }

    async verifyCartBadge(expectedItemsNumber: string)
    {
        await expect(this.cartBadge).toHaveText(expectedItemsNumber);
    }

    async goToCart()
    {
        await this.cartBadge.click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
    }
}


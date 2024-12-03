const { test, expect } = require('@playwright/test');

test.describe('Login, verify elements and add items to cart', () => {

    test.beforeEach('Perform login to Saucedemo', async ({ page }) => {
        await page.goto('/');
    
        //search by locator login form
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL('/inventory.html');
    });

    test('Verify and quantity items on page', async ({ page }) => {
        //verify elements on page
        const productsTitle = page.locator('.title');
        await expect(productsTitle).toHaveText('Products');
        await expect(productsTitle).toBeVisible();
    
        const shoppingCart = page.locator('.shopping_cart_link');
        await expect(shoppingCart).toBeVisible();
    
        //quantity products
        const productItems = page.locator('.inventory_item'); 
        const productCount = await productItems.count();
        expect(productCount).toBeGreaterThan(1);

    });

    test('Add product to the cart', async ({ page }) => { 

        // Add the first product to the cart
        const firstProduct = page.locator('.inventory_item').first();
        const firstProductName = firstProduct.locator('.inventory_item_name');
        const addToCartButton = firstProduct.locator('button:has-text("Add to cart")');
        await expect(firstProductName).toBeVisible();
        const productName = await firstProductName.innerText();
        await addToCartButton.click();

        // Verify the Shopping Cart icon shows "1"
        const shoppingCartBadge = page.locator('.shopping_cart_badge');
        await expect(shoppingCartBadge).toBeVisible();
        await expect(shoppingCartBadge).toHaveText('1');

        // 4. Open the Shopping Cart and verify the added product is displayed
        await page.click('.shopping_cart_link');
        

        const cartProductLocator = page.locator('.cart_item .inventory_item_name').first();
        await expect(cartProductLocator).toBeVisible();
        await expect(cartProductLocator).toHaveText(productName);

        // 5. Remove the product from the cart
        const removeButton = page.locator('button:has-text("Remove")');
        await removeButton.click();

        // 6. Verify no products are available in the Shopping Cart
        await expect(page.locator('.cart_item')).not.toBeVisible();
        await expect(shoppingCartBadge).not.toBeVisible();

    });

});


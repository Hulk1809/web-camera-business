import { test, expect } from '@playwright/test';

test.describe('Storefront E-Commerce User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storefront
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STORE-01: Verify Retail Header and Product Catalog render properly', async ({ page }) => {
    // Check Brand & Header elements
    await expect(page.locator('text=PRO GEAR').first()).toBeVisible();
    await expect(page.getByTestId('search-input')).toBeVisible();
    await expect(page.getByTestId('btn-open-warranty')).toBeVisible();
    await expect(page.getByTestId('btn-cart-drawer')).toBeVisible();

    // Verify product cards are displayed
    const productCards = page.getByTestId('product-card');
    await expect(productCards.first()).toBeVisible();
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-STORE-02: Live Search filters product list accurately', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('Sony');
    await page.waitForTimeout(400);

    // Verify main catalog filtered product cards contain 'Sony'
    const cards = page.locator('main').getByTestId('product-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const firstCardText = await cards.first().innerText();
    expect(firstCardText.toLowerCase()).toContain('sony');

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(300);
  });

  test('TC-STORE-03: Add to Cart and Complete VietQR Order Checkout', async ({ page }) => {
    // Locate the first available product card and click Quick Add
    const firstAddBtn = page.getByTestId('btn-quick-add-cart').first();
    await firstAddBtn.scrollIntoViewIfNeeded();
    await firstAddBtn.click();

    // Open Cart Drawer
    await page.getByTestId('btn-cart-drawer').click();

    // Ensure Checkout Form is displayed inside drawer
    await expect(page.getByTestId('input-customer-name')).toBeVisible();
    await expect(page.getByTestId('input-customer-phone')).toBeVisible();
    await expect(page.getByTestId('input-customer-address')).toBeVisible();

    // Fill customer checkout details
    await page.getByTestId('input-customer-name').fill('Nguyễn Văn Test');
    await page.getByTestId('input-customer-phone').fill('0988112233');
    await page.getByTestId('input-customer-address').fill('123 Đường 3/2, Quận 10, TP.HCM');

    // Select VietQR payment method
    await page.getByTestId('payment-method-vietqr').click();

    // Submit Order
    await page.getByTestId('btn-submit-order').click();

    // Verify Success Modal appears
    await expect(page.getByTestId('order-success-modal')).toBeVisible({ timeout: 10000 });
    const orderNumberEl = page.getByTestId('success-order-number');
    await expect(orderNumberEl).toBeVisible();

    const orderNumber = await orderNumberEl.innerText();
    expect(orderNumber).toMatch(/^PRO-\d{8}-\d{4}$/);

    // Verify VietQR section is present
    await expect(page.getByTestId('vietqr-payment-box')).toBeVisible();

    // Close success modal
    const closeBtn = page.getByTestId('btn-close-success-modal');
    await closeBtn.scrollIntoViewIfNeeded();
    await closeBtn.click();
    await expect(page.getByTestId('order-success-modal')).toBeHidden();
  });
});

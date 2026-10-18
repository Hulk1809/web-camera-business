import { test, expect } from '@playwright/test';

test.describe('POS Product Custom Selection & Pre-Order Fulfillment Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/admin/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle').catch(() => {});

    // If login screen is shown, log in as Quản Trị Trưởng
    const loginScreen = page.getByTestId('admin-login-screen');
    if (await loginScreen.isVisible()) {
      await page.getByTestId('input-admin-email').fill('admin@progear.vn');
      await page.getByTestId('input-admin-password').fill('admin123456');
      await page.getByTestId('btn-admin-login-submit').click();
      await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    }
  });

  test('TC-POS-01: Admin selects custom product at POS, price is auto-loaded, and invoice bill is printed instantly', async ({ page }) => {
    // 1. Open POS from top header
    const posHeaderBtn = page.getByTestId('btn-open-pos-header');
    await expect(posHeaderBtn).toBeVisible();
    await posHeaderBtn.click();

    // 2. POS Modal must be visible
    const posModalTitle = page.locator('text=Xuất Bán Tại Quầy Showroom (POS)');
    await expect(posModalTitle).toBeVisible();

    // 3. Select a product (Sony Cinema Line FX3)
    const productSelect = page.getByTestId('select-pos-product');
    await expect(productSelect).toBeVisible();

    // Select the Sony FX3 option by product ID
    await productSelect.selectOption({ value: 'prod-sony-fx3' });

    // 4. Verify unit price is automatically populated with 94,990,000 VND
    const priceInput = page.getByTestId('input-pos-price');
    await expect(priceInput).toHaveValue('94990000');

    // 5. Fill customer details
    await page.getByTestId('input-pos-customer-name').fill('Nguyễn Thành Đạt (DOP Saigon)');
    await page.getByTestId('input-pos-customer-phone').fill('0918 889 999');

    // 6. Verify total amount is calculated
    const totalAmountDisplay = page.getByTestId('pos-total-amount');
    await expect(totalAmountDisplay).toContainText('94.990.000');

    // 7. Click submit & print bill
    const submitBtn = page.getByTestId('btn-pos-submit');
    await submitBtn.click();

    // 8. Invoice modal must pop up with customer & device info and print button
    const invoiceModal = page.getByTestId('invoice-modal');
    await expect(invoiceModal).toBeVisible();

    await expect(page.getByTestId('invoice-customer-name')).toHaveText('Nguyễn Thành Đạt (DOP Saigon)');
    await expect(page.getByTestId('invoice-product-name')).toContainText('Sony Cinema Line FX3');
    await expect(page.getByTestId('invoice-total-amount')).toContainText('94.990.000');
    await expect(page.getByTestId('btn-print-invoice')).toBeVisible();
  });

  test('TC-PREORDER-01: Admin marks pre-order fulfilled when stock arrives with dedicated button and status updates to Đã Hoàn Tất', async ({ page }) => {
    // 1. Navigate to Orders tab
    await page.getByTestId('nav-orders').click();

    // 2. Filter by "Đặt Chờ Về" tab
    await page.locator('button:has-text("Đặt Chờ Về")').click();

    // 3. Find pre-order row with "Hàng Về - Giao Khách" button
    const fulfillBtn = page.getByTestId('btn-fulfill-preorder').first();
    await expect(fulfillBtn).toBeVisible();
    await expect(fulfillBtn).toContainText('Hàng Về - Giao Khách');

    // 4. Click fulfill
    await fulfillBtn.click();

    // 5. Verify the order row now has green "Đã Hoàn Tất" status badge
    await expect(page.locator('text=Đã Hoàn Tất').first()).toBeVisible();

    // 6. Click "Xem" to open Order Details modal
    const viewBtn = page.getByTestId('btn-view-order').first();
    await viewBtn.click();

    // 7. Order Details modal must display "Đã Hoàn Tất" and print button
    await expect(page.locator('text=Chi Tiết Đơn Hàng')).toBeVisible();
    await expect(page.locator('text=Đã Hoàn Tất (Đã giao khách)').first()).toBeVisible();
    await expect(page.getByTestId('btn-modal-print-order')).toBeVisible();
  });
});

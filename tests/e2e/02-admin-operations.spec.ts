import { test, expect } from '@playwright/test';

test.describe('Admin Enterprise Operations & POS Counter Sales', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/admin/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-ADMIN-01: Admin Sidebar navigation across all modules', async ({ page }) => {
    // Check Brand Header
    await expect(page.locator('text=PRO GEAR').first()).toBeVisible();

    // Navigate to Products
    await page.getByTestId('nav-products').click();
    await expect(page.locator('text=Quản Lý Thiết Bị, Máy Ảnh & Tồn Kho')).toBeVisible();

    // Navigate to Categories
    await page.getByTestId('nav-categories').click();
    await expect(page.locator('text=Danh Mục & Phân Loại Sản Phẩm')).toBeVisible();

    // Navigate to Warranty
    await page.getByTestId('nav-warranty').click();
    await expect(page.locator('text=Quản Lý Serial & Bảo Hành Điện Tử')).toBeVisible();

    // Navigate back to Orders
    await page.getByTestId('nav-orders').click();
    await expect(page.locator('text=Quản Lý Đơn Đặt Hàng & Dự Án')).toBeVisible();
  });

  test('TC-ADMIN-02: Orders list view and inspection modal', async ({ page }) => {
    await page.getByTestId('nav-orders').click();

    // Verify order rows are present
    const orderRows = page.getByTestId('admin-order-row');
    await expect(orderRows.first()).toBeVisible();

    // View the first order
    const firstViewBtn = page.getByTestId('btn-view-order').first();
    await firstViewBtn.click();

    // Modal should be visible with order details
    await expect(page.locator('text=CHI TIẾT ĐƠN HÀNG')).toBeVisible();

    // Close modal
    await page.locator('button:has(svg.lucide-x)').first().click();
    await expect(page.locator('text=CHI TIẾT ĐƠN HÀNG')).toBeHidden();
  });

  test('TC-ADMIN-03: POS Counter Sale and Instant Electronic Warranty Activation', async ({ page }) => {
    await page.getByTestId('nav-warranty').click();

    // Look for an in-stock serial with "Bán POS" button
    const posSellBtn = page.getByTestId('btn-pos-sell').first();
    await expect(posSellBtn).toBeVisible();

    // Click POS sell
    await posSellBtn.click();

    // Ensure POS Modal is opened
    await expect(page.locator('text=Xuất Bán Tại Quầy Showroom (POS)')).toBeVisible();

    // Fill customer info
    const testCustomer = 'Nguyễn Thị Thuý - POS';
    const testPhone = '0903123456';
    await page.getByTestId('input-pos-customer-name').fill(testCustomer);
    await page.getByTestId('input-pos-customer-phone').fill(testPhone);

    // Submit POS sale
    await page.getByTestId('btn-pos-submit').click();

    // Wait for modal to close and table to refresh
    await expect(page.locator('text=Xuất Bán Tại Quầy Showroom (POS)')).toBeHidden({ timeout: 10000 });

    // Verify the newly sold customer name appears in the table with active warranty
    await expect(page.locator(`text=${testCustomer}`).first()).toBeVisible();
    await expect(page.locator('text=Đã Bán • Đang Bảo Hành').first()).toBeVisible();
  });
});

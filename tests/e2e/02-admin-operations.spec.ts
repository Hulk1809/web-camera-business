import { test, expect } from '@playwright/test';

test.describe('Admin Enterprise Operations & POS Counter Sales', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/admin/');
    await page.waitForLoadState('domcontentloaded');
    const loginScreen = page.getByTestId('admin-login-screen');
    if (await loginScreen.isVisible()) {
      await page.getByTestId('input-admin-email').fill('admin@progear.vn');
      await page.getByTestId('input-admin-password').fill('admin123456');
      await page.getByTestId('btn-admin-login-submit').click();
      await expect(loginScreen).toBeHidden({ timeout: 5000 });
    }
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
    const productsResponse = await page.request.get('http://localhost:4000/api/products?limit=100');
    const products = (await productsResponse.json()).items;
    const product = products.find((item: any) => item.stockQuantity > 0);
    const serialNumber = `QA-POS-${Date.now()}`;
    const serialResponse = await page.request.post('http://localhost:4000/api/warranty', {
      data: { productId: product.id, serialNumber, warrantyMonths: 24 },
    });
    expect(serialResponse.status()).toBe(201);
    await page.reload();
    await page.getByTestId('btn-open-pos-header').click();
    await page.getByTestId('select-pos-product').selectOption(product.id);

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
    const warrantyResponse = await page.request.get('http://localhost:4000/api/warranty');
    const persistedSerial = (await warrantyResponse.json()).find((item: any) => item.serialNumber === serialNumber);
    expect(persistedSerial).toMatchObject({ status: 'SOLD', customerName: testCustomer });
  });

  test('TC-ADMIN-04: Revenue Statement (Doanh Số & Sao Kê), Category Breakdown and Audit Receipts', async ({ page }) => {
    // 1. Navigate to Doanh Số & Sao Kê via sidebar
    await page.getByTestId('nav-finance').click();
    await expect(page.locator('text=Báo Cáo Doanh Số & Sao Kê Tài Chính')).toBeVisible();
    await expect(page.locator('text=Sổ Cái Đối Soát Doanh Số & Dòng Tiền')).toBeVisible();

    // 2. Check top financial cards (MBBank VietQR and Realized Revenue)
    await expect(page.locator('text=Chuyển Khoản MBBank VietQR')).toBeVisible();
    await expect(page.locator('text=STK: 888899996688').first()).toBeVisible();

    // 3. Check Category breakdown cards
    await expect(page.locator('text=Bảng Phân Bổ Doanh Số Theo Danh Mục Hàng Hóa')).toBeVisible();
    await expect(page.getByTestId('card-category-stat-Máy Ảnh Mirrorless & DSLR')).toBeVisible();
    await expect(page.getByTestId('card-category-stat-Flycam & Drone DJI')).toBeVisible();

    // 4. Verify statement audit ledger rows
    const statementRows = page.locator('tr[data-testid^="row-statement-order-"]');
    await expect(statementRows.first()).toBeVisible();

    // 5. Inspect a transaction receipt
    const firstReceiptBtn = page.locator('button[data-testid^="btn-view-receipt-"]').first();
    await firstReceiptBtn.click();

    // Verify modal content
    await expect(page.getByTestId('modal-receipt-inspection')).toBeVisible();
    await expect(page.locator('text=PHIẾU THU & CHỨNG TỪ SAO KÊ')).toBeVisible();
    await expect(page.locator('text=CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ PRO GEAR VIỆT NAM')).toBeVisible();

    // Close modal
    await page.locator('button:has(svg.lucide-x)').first().click();
    await expect(page.getByTestId('modal-receipt-inspection')).toBeHidden();

    // 6. Navigate back to dashboard and verify clicking Total Revenue KPI card opens finance tab
    await page.getByTestId('nav-dashboard').click();
    await expect(page.locator('text=Tổng Quan Tình Hình Kinh Doanh')).toBeVisible();
    await page.getByTestId('kpi-card-total-revenue').click();
    await expect(page.locator('text=Báo Cáo Doanh Số & Sao Kê Tài Chính')).toBeVisible();
  });
});

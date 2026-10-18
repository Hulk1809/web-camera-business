import { test, expect } from '@playwright/test';

test.describe('Admin Product Technical Specifications & Image Management', () => {
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

  test('TC-PROD-01: Admin creates new product with custom technical specs, preset image selection, and verifies save', async ({ page }) => {
    // 1. Navigate to Products tab
    await page.getByTestId('nav-products').click();
    await expect(page.locator('text=Quản Lý Thiết Bị, Máy Ảnh & Tồn Kho')).toBeVisible();

    // 2. Open Add Product Modal
    const addBtn = page.getByTestId('btn-open-add-product');
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // 3. Verify modal is visible
    await expect(page.locator('text=Thêm Thiết Bị Mới Vào Kho Hàng')).toBeVisible();

    // 4. Fill basic info
    const testName = 'Canon Cinema EOS C70 Super 35 4K DGO';
    const testSku = 'CANON-C70-PRO';
    await page.getByTestId('input-product-name').fill(testName);
    await page.getByTestId('input-product-sku').fill(testSku);
    await page.getByTestId('select-product-brand').selectOption('Canon');
    await page.getByTestId('select-product-category').selectOption('Máy Quay Điện Ảnh & Cinema');
    await page.getByTestId('input-product-stock').fill('15');
    await page.getByTestId('input-product-price').fill('119990000');
    await page.getByTestId('input-product-original-price').fill('128000000');

    // 5. Switch to Images tab
    await page.getByTestId('tab-prod-images').click();
    await expect(page.locator('text=Tải ảnh từ máy tính lên (Computer Upload)')).toBeVisible();

    // Select preset image
    const canonPreset = page.getByTestId('preset-img-Canon');
    await canonPreset.click();

    // Verify live preview shows
    const previewBox = page.getByTestId('product-image-preview');
    await expect(previewBox).toBeVisible();

    // 6. Switch to Specs tab
    await page.getByTestId('tab-prod-specs').click();
    await expect(page.locator('text=Bảng Thông Số Kỹ Thuật Điện Ảnh')).toBeVisible();

    // Click auto preset specs
    await page.getByTestId('btn-preset-specs').click();

    // Customize specific specs
    await page.getByTestId('input-spec-sensor').fill('Super 35mm Dual Gain Output (DGO) Sensor');
    await page.getByTestId('input-spec-video').fill('4K 120p 4:2:2 10-bit Canon Log 2/3');
    await page.getByTestId('input-spec-weight').fill('1190g (Thân máy tích hợp filter ND 10 stops)');

    // Add a custom spec
    await page.getByTestId('btn-add-custom-spec').click();
    const customKeyInput = page.locator('input[placeholder="Tên thông số (VD: Màn hình)"]').first();
    const customValInput = page.locator('input[placeholder="Giá trị (VD: 3.0-inch xoay lật 1.44M điểm ảnh)"]').first();
    await customKeyInput.fill('Ngàm ống kính');
    await customValInput.fill('Canon RF Mount & Kính lọc ND tích hợp');

    // 7. Switch to Desc tab
    await page.getByTestId('tab-prod-desc').click();
    await page.getByTestId('input-product-short-desc').fill('Dòng máy quay điện ảnh cinema nhỏ gọn chuyên nghiệp cảm biến Super 35mm DGO.');

    // 8. Submit form
    await page.getByTestId('btn-submit-product').click();

    // 9. Verify modal closes
    await expect(page.locator('text=Thêm Thiết Bị Mới Vào Kho Hàng')).toBeHidden({ timeout: 5000 });

    // 10. Verify product appears in the table
    await expect(page.locator(`text=${testName}`).first()).toBeVisible();
    await expect(page.locator(`text=${testSku}`).first()).toBeVisible();
  });

  test('TC-PROD-02: Admin edits product to update price and technical specs', async ({ page }) => {
    // 1. Navigate to Products tab
    await page.getByTestId('nav-products').click();

    // 2. Click Edit on the first product row
    const editBtn = page.locator('button[data-testid^="btn-edit-product-"]').first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // 3. Verify Edit Modal is open
    await expect(page.locator('text=Chỉnh Sửa Thiết Bị & Thông Số Kỹ Thuật')).toBeVisible();

    // 4. Update price
    const priceInput = page.getByTestId('input-product-price');
    await priceInput.fill('115000000');

    // 5. Switch to Specs tab
    await page.getByTestId('tab-prod-specs').click();
    await page.getByTestId('input-spec-stabilization').fill('Chống rung điện tử kết hợp IBIS 5 trục');

    // 6. Save changes
    await page.getByTestId('btn-submit-product').click();
    await expect(page.locator('text=Chỉnh Sửa Thiết Bị & Thông Số Kỹ Thuật')).toBeHidden({ timeout: 5000 });

    // 7. Verify updated price in table
    await expect(page.locator('text=115.000.000').first()).toBeVisible();
  });

  test('TC-PROD-03: Storefront QuickView modal displays accurate technical specs and cinematography labels', async ({ page }) => {
    // 1. Open Storefront
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');

    // 2. Click first product card
    const firstProduct = page.getByTestId('product-card').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    // 3. Verify QuickView modal opens
    await expect(page.locator('text=THÔNG SỐ KỸ THUẬT NỔI BẬT:')).toBeVisible();

    // 4. Verify spec labels are displayed professionally
    await expect(page.locator('text=Cảm biến (Sensor):').first()).toBeVisible();
    await expect(page.locator('text=Quay Video:').first()).toBeVisible();
  });

  test('TC-PROD-04: Admin correctly parses stockQuantity from shared storage and displays positive stock and in-stock badges', async ({ page }) => {
    // 1. Simulate web-store saving products with stockQuantity (without stock property)
    await page.evaluate(() => {
      const mockSharedProducts = [
        {
          id: 'prod-dji-m3pro',
          name: 'DJI Mavic 3 Pro Cine Combo - 3 Camera Hasselblad Apple ProRes',
          sku: 'DJI-MAVIC3-PRO-CINE',
          brand: 'DJI',
          category: 'Flycam & Drone DJI',
          price: 79990000,
          originalPrice: 87500000,
          stockQuantity: 12, // Only stockQuantity, no stock
          imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
        },
        {
          id: 'prod-canon-r5m2',
          name: 'Canon EOS R5 Mark II Body - 45MP Stacked CMOS & 8K 60p RAW',
          sku: 'CANON-R5-M2-BODY',
          brand: 'Canon',
          category: 'Máy Ảnh Mirrorless & DSLR',
          price: 104990000,
          originalPrice: 115000000,
          stockQuantity: 6, // Only stockQuantity
          imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
        },
      ];
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(mockSharedProducts));
    });

    // 2. Reload admin page to trigger normalization
    await page.reload();
    await page.getByTestId('nav-products').click();
    await expect(page.locator('text=Quản Lý Thiết Bị, Máy Ảnh & Tồn Kho')).toBeVisible();

    // 3. Verify stock quantities are normalized and shown properly (>0, NOT 0 cái)
    await expect(page.locator('text=12').first()).toBeVisible();
    await expect(page.locator('text=6').first()).toBeVisible();

    // 4. Verify "Sẵn hàng" is displayed for these items, NOT "Hết Sẵn • Pre-Order"
    await expect(page.locator('text=Sẵn hàng').first()).toBeVisible();

    // 5. Verify image elements have valid sources
    const imgElements = page.locator('tbody img');
    const firstImgSrc = await imgElements.first().getAttribute('src');
    expect(firstImgSrc).toBeTruthy();
  });
});


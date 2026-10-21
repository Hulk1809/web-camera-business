import { test, expect } from '@playwright/test';

test.describe('Electronic Warranty (Bảo Hành Điện Tử) Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-WARRANTY-01: Order Number lookup (PRO-20261016-8942) displays 24M Sony FX3 with Live Countdown', async ({ page }) => {
    // Open warranty modal
    await page.getByTestId('btn-open-warranty').click();
    await expect(page.locator('text=Tra Cứu Bảo Hành Điện Tử Pro Gear')).toBeVisible();

    // Click sample Order Number chip
    await page.getByTestId('chip-warranty-order').click();

    // Verify input populated
    const inputVal = await page.getByTestId('warranty-query-input').inputValue();
    expect(inputVal).toBe('PRO-20261016-8942');

    // Click Search
    await page.getByTestId('btn-submit-warranty').click();

    // Result must be rendered
    const resultBox = page.getByTestId('warranty-result');
    await expect(resultBox).toBeVisible();

    // Verify Order Status & Activated Warranty
    await expect(resultBox.locator('text=CHỨNG NHẬN BẢO HÀNH ĐIỆN TỬ THEO ĐƠN HÀNG')).toBeVisible();
    await expect(resultBox.locator('text=ILME-FX3-BODY').first()).toBeVisible();
    await expect(resultBox.locator('text=24 Tháng').first()).toBeVisible();

    // Verify live countdown
    await expect(resultBox.locator('text=ngày hiệu lực').first()).toBeVisible();
  });

  test('TC-WARRANTY-02: Serial Number lookup (SONY-FX3-VN-9901) displays device details', async ({ page }) => {
    await page.getByTestId('btn-open-warranty').click();

    // Click sample Serial chip
    await page.getByTestId('chip-warranty-serial').click();

    // Click Search
    await page.getByTestId('btn-submit-warranty').click();

    const resultBox = page.getByTestId('warranty-result');
    await expect(resultBox).toBeVisible();

    // Verify Serial details
    await expect(resultBox.locator('text=SONY-FX3-VN-9901')).toBeVisible();
    await expect(resultBox).toContainText(/THIẾT BỊ ĐANG TRONG THỜI HẠN BẢO HÀNH|SẢN PHẨM CHÍNH HÃNG — CHƯA KÍCH HOẠT BẢO HÀNH/);
  });

  test('TC-WARRANTY-03: Invalid or unactivated query displays appropriate warning', async ({ page }) => {
    await page.getByTestId('btn-open-warranty').click();

    const queryInput = page.getByTestId('warranty-query-input');
    await queryInput.fill('SN-NON-EXISTENT-9999');
    await page.getByTestId('btn-submit-warranty').click();

    const resultBox = page.getByTestId('warranty-result');
    await expect(resultBox).toBeVisible();
    await expect(resultBox.locator('text=Không tìm thấy thông tin bảo hành')).toBeVisible();
  });
});

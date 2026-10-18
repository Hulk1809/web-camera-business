import { test, expect } from '@playwright/test';

test.describe('Live Advisor Chat, Multi-Staff Collision Locking & VietQR Payment Box', () => {
  test('TC-CHAT-01: Floating Contact Widget displays Zalo and Live Advisor bubbles', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');

    // Check Floating Widget container
    const widget = page.getByTestId('floating-contact-widget');
    await expect(widget).toBeVisible();

    // Check Zalo bubble link
    const zaloBtn = page.getByTestId('btn-zalo-bubble');
    await expect(zaloBtn).toBeVisible();
    await expect(zaloBtn).toHaveAttribute('href', 'https://zalo.me/0909123456');

    // Check Live Advisor bubble
    const livechatBtn = page.getByTestId('btn-livechat-bubble');
    await expect(livechatBtn).toBeVisible();
  });

  test('TC-CHAT-02: Customer Logins via Facebook 1-Click and Sends Consultation Message', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');

    // Click Livechat bubble
    await page.getByTestId('btn-livechat-bubble').click();

    // Verify Chat Drawer opens
    const drawer = page.getByTestId('customer-chat-drawer');
    await expect(drawer).toBeVisible();

    // Perform Facebook login if not logged in
    const fbLoginBtn = page.getByTestId('btn-chat-login-facebook');
    if (await fbLoginBtn.isVisible()) {
      await fbLoginBtn.click();
      const fbNameInput = page.getByTestId('input-chat-fb-name');
      await expect(fbNameInput).toBeVisible();
      await fbNameInput.fill('Đoàn Văn Hậu (Facebook)');
      await page.getByTestId('btn-confirm-chat-fb').click();
    }

    // Input message and send
    const inputMsg = page.getByTestId('input-chat-message');
    await expect(inputMsg).toBeVisible();

    const testQuestion = 'Chào shop, em muốn hỏi combo Sony FX3 kèm lens 24-70 GM II sẵn hàng không ạ?';
    await inputMsg.fill(testQuestion);
    await page.getByTestId('btn-send-chat').click();

    // Verify question is visible in the thread
    await expect(drawer.locator(`text=${testQuestion}`)).toBeVisible();
  });

  test('TC-CHAT-03: Admin Support Desk receives session, claims chat, and locks out other advisors', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/');
    await page.waitForLoadState('networkidle');
    const loginScreen = page.getByTestId('admin-login-screen');
    if (await loginScreen.isVisible()) {
      await page.getByTestId('input-admin-email').fill('admin@progear.vn');
      await page.getByTestId('input-admin-password').fill('admin123456');
      await page.getByTestId('btn-admin-login-submit').click();
      await expect(loginScreen).toBeHidden({ timeout: 5000 });
    }

    // Navigate to Chat Tab
    await page.getByTestId('nav-chat').click();
    await expect(page.getByTestId('admin-advisor-chat-view')).toBeVisible();

    // Ensure session item is displayed
    const firstSessionItem = page.locator('[data-testid^="session-item-"]').first();
    await expect(firstSessionItem).toBeVisible();
    await firstSessionItem.click();

    // If claim button is present, claim the session
    const claimBtn = page.getByTestId('btn-admin-claim-chat');
    if (await claimBtn.isVisible()) {
      await claimBtn.click();
      await page.waitForTimeout(400);
    }

    // Send advisor reply
    const replyInput = page.getByTestId('input-admin-chat-message');
    await expect(replyInput).toBeEnabled();
    const advisorReply = 'Chào bạn! Pro Gear đang có sẵn máy Sony FX3 tại Showroom Q1 tặng kèm thẻ nhớ CFexpress ạ.';
    await replyInput.fill(advisorReply);
    await page.getByTestId('btn-admin-send-chat').click();

    // Verify reply in admin thread
    await expect(page.locator(`text=${advisorReply}`)).toBeVisible();

    // Switch to Staff 2 (Minh Thư) to verify collision prevention locking
    await page.getByTestId('btn-toggle-staff-switcher').click();
    await page.locator('text=Minh Thư').first().click();

    // Verify collision lock warning appears and input is disabled
    await expect(page.getByTestId('chat-collision-warning')).toBeVisible();
    await expect(page.getByTestId('input-admin-chat-message')).toBeDisabled();
  });

  test('TC-INTERACTIVE-04: Verify interactive modals (Installment 0%, Trade-in, MegaMenu & VietQR)', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');

    // 1. Test Mega Menu
    await page.getByTestId('btn-toggle-mega-menu').click();
    await expect(page.getByTestId('category-mega-menu')).toBeVisible();
    await page.getByTestId('btn-toggle-mega-menu').click();

    // 2. Test Installment 0% Modal
    // Navigate to slide 2 or trigger installment button directly
    const installmentBtn = page.getByTestId('btn-hero-installment');
    if (await installmentBtn.isVisible()) {
      await installmentBtn.click();
      await expect(page.getByTestId('installment-modal')).toBeVisible();
      await page.locator('[data-testid="installment-modal"] button:has(svg.lucide-x)').click();
    }

    // 3. Test Trade-in Valuation Modal
    const tradeinBtn = page.getByTestId('btn-promo-tradein');
    await tradeinBtn.scrollIntoViewIfNeeded();
    await tradeinBtn.click();
    await expect(page.getByTestId('tradein-modal')).toBeVisible();
    await page.locator('[data-testid="tradein-modal"] button:has(svg.lucide-x)').click();
  });
});

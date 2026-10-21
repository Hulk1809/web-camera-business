import { test, expect } from '@playwright/test';

test.describe('Security Gate, Customer Auth with Real Name, & Category Mega Menu Fixes', () => {
  test('TC-SEC-01: Public Storefront Topbar does NOT expose internal "Trang Admin" link', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');

    // Verify "Trang Admin" link is not visible in customer topbar
    await expect(page.locator('text=Trang Admin')).toBeHidden();

    // Verify customer login/register button is present
    await expect(page.getByTestId('btn-customer-login-header')).toBeVisible();
  });

  test('TC-SEC-02: Admin portal is protected by Enterprise Login Screen and blocks dashboard access', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');

    // Must show Admin Login Screen
    await expect(page.getByTestId('admin-login-screen')).toBeVisible();
    await expect(page.locator('text=CỔNG QUẢN TRỊ NỘI BỘ • BẢO MẬT 256-BIT')).toBeVisible();

    // Dashboard navigation must NOT be visible without login
    await expect(page.getByTestId('nav-dashboard')).toBeHidden();
    await expect(page.getByTestId('nav-orders')).toBeHidden();
  });

  test('TC-SEC-03: Admin login validates credentials, grants access to dashboard, and logs out securely', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');

    // 1. Test invalid password
    await page.getByTestId('input-admin-email').fill('admin@progear.vn');
    await page.getByTestId('input-admin-password').fill('wrongpassword123');
    await page.getByTestId('btn-admin-login-submit').click();

    // Error alert must be shown
    await expect(page.getByTestId('admin-login-error')).toBeVisible();
    await expect(page.getByTestId('nav-dashboard')).toBeHidden();

    // 2. Test valid login
    await page.getByTestId('input-admin-password').fill('admin123456');
    await page.getByTestId('btn-admin-login-submit').click();

    // Login screen should disappear and Dashboard should be visible
    await expect(page.getByTestId('admin-login-screen')).toBeHidden();
    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
    await expect(page.locator('text=Tổng Quan Tình Hình Kinh Doanh')).toBeVisible();

    // 3. Test logout
    await page.getByTestId('btn-admin-logout').click();
    await expect(page.getByTestId('admin-login-screen')).toBeVisible();
    await expect(page.getByTestId('nav-dashboard')).toBeHidden();
  });

  test('TC-CUST-01: Customer logs in on Storefront header with custom name and manages account', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');

    // Click Login on Header
    await page.getByTestId('btn-customer-login-header').click();
    await expect(page.getByTestId('customer-auth-modal')).toBeVisible();

    // Enter real customer name
    const customerRealName = 'Lê Hoàng Phúc';
    await page.getByTestId('input-customer-fullname').fill(customerRealName);
    await page.getByTestId('input-customer-email').fill('hoangphuc.dop@gmail.com');
    await page.getByTestId('btn-customer-submit-login').click();

    // Modal closes and Header displays exact real name
    await expect(page.getByTestId('customer-auth-modal')).toBeHidden();
    await expect(page.getByTestId('customer-name-display')).toHaveText(customerRealName);

    // Logout
    await page.getByTestId('btn-customer-logout').click();
    await expect(page.getByTestId('btn-customer-login-header')).toBeVisible();
  });

  test('TC-CUST-02: Customer connects via Facebook with custom display name in Live Chat', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');

    // Open Live Chat
    await page.getByTestId('btn-livechat-bubble').click();
    await expect(page.getByTestId('customer-chat-drawer')).toBeVisible();

    // Click Facebook login -> prompts for Facebook display name
    await page.getByTestId('btn-chat-login-facebook').click();
    await expect(page.getByTestId('input-chat-fb-name')).toBeVisible();

    const realFbName = 'Phan Thanh Hà';
    await page.getByTestId('input-chat-fb-name').fill(realFbName);
    await page.getByTestId('btn-confirm-chat-fb').click();

    // Send chat question
    const chatInput = page.getByTestId('input-chat-message');
    await expect(chatInput).toBeVisible();
    await chatInput.fill('Shop có giao hỏa tốc Sony FX3 trong 2h ở Hà Nội không?');
    await page.getByTestId('btn-send-chat').click();

    // Verify customer's real name is displayed on storefront header as well
    await expect(page.getByTestId('customer-name-display')).toHaveText(realFbName);
  });

  test('TC-CAT-01: Category Mega Menu opens from Header, filters DJI Drone category, and scrolls smoothly', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');

    // Click the red "DANH MỤC" button in the sticky header
    const megaMenuBtn = page.getByTestId('btn-toggle-mega-menu');
    await expect(megaMenuBtn).toBeVisible();
    await megaMenuBtn.click();

    // Mega menu should be visible
    const megaMenu = page.getByTestId('category-mega-menu');
    await expect(megaMenu).toBeVisible();

    // Click category "Flycam & Drone DJI"
    const droneCatBtn = page.getByTestId('btn-category-Flycam & Drone DJI');
    await expect(droneCatBtn).toBeVisible();
    await droneCatBtn.click();

    // Mega menu should close
    await expect(megaMenu).toBeHidden();

    // Products grid should now display DJI products and have filtered list
    await expect(page.locator('text=DJI Mavic 3 Pro Cine Combo').first()).toBeVisible();
  });

  test('TC-CAT-02: Hero Left Sidebar opens interactive hover flyout mega menu, filters category on click, and clears filter', async ({ page }) => {
    // Set viewport wide enough for desktop left sidebar (hidden on mobile/tablet)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('domcontentloaded');

    // Sidebar should be visible on desktop
    const sidebar = page.getByTestId('hero-category-sidebar');
    await expect(sidebar).toBeVisible();

    // Hover over "Flycam & Drone"
    const flycamBtn = page.getByTestId('btn-sidebar-category-Flycam & Drone');
    await expect(flycamBtn).toBeVisible();
    await flycamBtn.hover();

    // Flyout submenu mega panel must appear
    const flyout = page.getByTestId('sidebar-category-flyout');
    await expect(flyout).toBeVisible();
    await expect(flyout.locator('text=Flycam & Drone DJI')).toBeVisible();

    // Click the sidebar category button
    await flycamBtn.click();

    // Dynamic title should indicate active category
    const catalogTitle = page.getByTestId('catalog-header-title');
    await expect(catalogTitle).toContainText('FLYCAM & DRONE');

    // Filtered product must be visible
    await expect(page.locator('text=DJI Mavic 3 Pro Cine Combo').first()).toBeVisible();

    // Reset filter
    const clearBtn = page.getByTestId('btn-clear-category-filter');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // Title returns to default
    await expect(catalogTitle).toContainText('KHO MÁY ẢNH, FLYCAM, GIMBAL & PHỤ KIỆN CHÍNH HÃNG');
  });
});

import { test, expect } from '@playwright/test';

// Requires dedicated disposable API/database; never run against production.
test.describe('Store live API QA', () => {
  test.beforeEach(async ({ page }, info) => {
    const events: string[] = [];
    page.on('console', m => { if (m.type() === 'error') events.push(`console: ${m.text()}`); });
    page.on('pageerror', e => events.push(`pageerror: ${e.message}`));
    page.on('response', r => { if (r.url().includes('/api/')) events.push(`${r.status()} ${r.request().method()} ${r.url()}`); });
    (info as any).qaEvents = events;
    const response = page.waitForResponse(r => r.url().includes('/api/products?limit=100'));
    await page.goto('http://localhost:3000/');
    const r = await response;
    expect(r.status()).toBe(200);
    const products = (await r.json()).items;
    expect(products.length).toBeGreaterThan(0);
    await expect(page.locator('#product-catalog [data-sku]').first()).toHaveAttribute('data-sku', products[0].sku);
  });
  test.afterEach(async ({ page }, info) => {
    await info.attach('browser-events', { body: JSON.stringify((info as any).qaEvents, null, 2), contentType: 'application/json' });
    await page.screenshot({ path: info.outputPath('screen.png'), fullPage: true });
  });
  test('catalog exact API SKU set, search, empty state and price filter', async ({ page, request }) => {
    const products = (await (await request.get('http://localhost:4000/api/products?limit=100')).json()).items;
    const cards = page.locator('#product-catalog [data-sku]');
    expect((await cards.evaluateAll(es => es.map(e => e.getAttribute('data-sku')))).sort()).toEqual(products.map((p:any) => p.sku).sort());
    await page.getByTestId('search-input').fill('ILCE-7M4-BODY');
    await expect(cards).toHaveCount(1);
    await page.getByTestId('search-input').fill('QA-NO-MATCH-123456');
    await expect(cards).toHaveCount(0);
    await expect(page.getByText('Chưa có sản phẩm nào thuộc bộ lọc này')).toBeVisible();
    await page.getByTestId('search-input').clear();
    await page.getByRole('button', { name: 'Dưới 20 triệu', exact: true }).click();
    expect((await cards.evaluateAll(es => es.map(e => e.getAttribute('data-sku')))).sort()).toEqual(products.filter((p:any) => p.price < 20000000).map((p:any) => p.sku).sort());
  });
  test('desktop sidebar hover and category reset use API products', async ({page, request}) => {
    await page.setViewportSize({width:1440,height:900});
    await page.getByTestId('btn-sidebar-category-Flycam & Drone').hover();
    await expect(page.getByTestId('sidebar-category-flyout')).toBeVisible();
    await page.getByTestId('btn-sidebar-category-Flycam & Drone').click();
    const products=(await (await request.get('http://localhost:4000/api/products?limit=100')).json()).items;
    const cards=page.locator('#product-catalog [data-sku]');
    expect((await cards.evaluateAll(es=>es.map(e=>e.getAttribute('data-sku')))).sort()).toEqual(products.filter((p:any)=>p.category.name==='Flycam & Drone DJI').map((p:any)=>p.sku).sort());
    await page.getByTestId('btn-clear-category-filter').click();
    await expect(cards).toHaveCount(products.length);
  });
  test('detail specifications, wishlist reload persistence', async ({ page }) => {
    const card = page.locator('#product-catalog [data-sku="ILCE-7M4-BODY"]');
    await card.getByTitle('Thêm vào yêu thích').click();
    await page.reload();
    await expect(card.getByTitle('Thêm vào yêu thích').locator('svg')).toHaveClass(/fill-current/);
    await card.click();
    await expect(page.getByText('Thông Số Kỹ Thuật Nổi Bật:')).toBeVisible();
    await expect(page.getByText('759 điểm lấy nét theo pha, Real-time Eye AF người/động vật/chim', {exact:true})).toBeVisible();
  });
  for (const malformedWishlist of ['null', '{}']) {
    test(`malformed wishlist ${malformedWishlist} does not blank the Store`, async ({ page }) => {
      await page.evaluate((value) => localStorage.setItem('PRO_GEAR_WISHLIST', value), malformedWishlist);
      await page.reload();
      await expect(page.locator('#product-catalog [data-sku]').first()).toBeVisible();
      await expect(page.locator('#root')).not.toBeEmpty();
    });
  }
  for (const method of ['cod', 'vietqr']) test(`checkout ${method} persists real order and decrements API stock`, async ({ page, request }) => {
    const products = (await (await request.get('http://localhost:4000/api/products?limit=100')).json()).items;
    const p = products.find((p:any) => p.sku === 'DJI-MIC2-COMBO');
    await page.locator(`#product-catalog [data-sku="${p.sku}"]`).getByTestId('btn-quick-add-cart').click();
    await page.getByTestId('btn-cart-drawer').click();
    await page.getByTestId('btn-submit-order').click();
    await expect(page.getByTestId('order-success-modal')).toBeHidden();
    await page.getByTestId('input-customer-name').fill('QA Store Disposable');
    await page.getByTestId('input-customer-phone').fill('0900000042');
    await page.getByTestId('input-customer-address').fill('QA test address');
    await page.getByTestId(`payment-method-${method}`).click();
    const response = page.waitForResponse(r => r.url().endsWith('/api/orders') && r.request().method() === 'POST');
    await page.getByTestId('btn-submit-order').click();
    const r = await response;
    expect(r.status()).toBe(201);
    const order = await r.json();
    await expect(page.getByTestId('success-order-number')).toHaveText(order.orderNumber);
    expect((await (await request.get(`http://localhost:4000/api/orders/${order.id}`)).json()).id).toBe(order.id);
    const after = (await (await request.get('http://localhost:4000/api/products?limit=100')).json()).items.find((x:any) => x.id === p.id);
    expect(after.stockQuantity).toBe(p.stockQuantity - 1);
    if (method === 'vietqr') {
      await expect(page.getByTestId('vietqr-payment-box')).toBeVisible();
      await expect(page.getByTestId('vietqr-image')).toHaveAttribute('src', new RegExp(String(order.totalAmount)));
    }
  });
  test('warranty serial resolves from API', async ({ page }) => {
    await page.getByTestId('btn-open-warranty').click();
    await page.getByTestId('warranty-query-input').fill('SONY-FX3-VN-9901');
    const response = page.waitForResponse(r => r.url().includes('/api/warranty/SONY-FX3-VN-9901'));
    await page.getByTestId('btn-submit-warranty').click();
    expect((await response).ok()).toBeTruthy();
    await expect(page.getByTestId('warranty-result')).toContainText('SONY-FX3-VN-9901');
  });
  test('mobile viewport layout and cart interaction', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.getByTestId('btn-cart-drawer').click();
    await expect(page.getByText('Chưa có sản phẩm nào trong giỏ hàng')).toBeVisible();
  });
  test('cart quantity increase/decrease/remove controls', async ({ page }) => {
    await page.locator('#product-catalog [data-sku="DJI-MIC2-COMBO"]').getByTestId('btn-quick-add-cart').click();
    await page.getByTestId('btn-cart-drawer').click();
    await page.locator('button:has(svg.lucide-plus)').click();
    await expect(page.getByText('Giỏ Hàng Của Bạn (2 sản phẩm)', {exact:true})).toBeVisible();
    await page.locator('button:has(svg.lucide-minus)').click();
    await expect(page.getByText('Giỏ Hàng Của Bạn (1 sản phẩm)', {exact:true})).toBeVisible();
    await page.locator('button:has(svg[class*="lucide-trash"])').click();
    await expect(page.getByText('Chưa có sản phẩm nào trong giỏ hàng')).toBeVisible();
  });
  test('BUG: tracking finds an API order in a fresh browser', async ({ page, request }) => {
    const products = (await (await request.get('http://localhost:4000/api/products?limit=100')).json()).items;
    const r = await request.post('http://localhost:4000/api/orders', { data: { customerName: 'QA tracking', customerPhone: '0900000044', shippingAddress: 'QA address', paymentMethod: 'COD', items: [{ productId: products.find((p:any) => p.sku === 'DJI-MIC2-COMBO').id, quantity: 1 }] } });
    expect(r.status()).toBe(201);
    const order = await r.json();
    await page.getByRole('button', { name: 'Tra cứu tình trạng đơn hàng', exact:true }).click();
    await page.getByPlaceholder('Nhập Mã Đơn hoặc SĐT...').fill(order.orderNumber);
    await page.getByRole('button', { name: 'Tra Cứu', exact: true }).click();
    await expect(page.getByText(`Mã: ${order.orderNumber}`, {exact:true})).toBeVisible();
  });
  test('tracked API order cancellation persists on server', async ({ page, request }) => {
    const products = (await (await request.get('http://localhost:4000/api/products?limit=100')).json()).items;
    const product = products.find((p:any) => p.sku === 'DJI-MIC2-COMBO');
    const created = await request.post('http://localhost:4000/api/orders', { data: {
      customerName: 'QA cancel', customerPhone: '0900000045', shippingAddress: 'QA address',
      paymentMethod: 'COD', items: [{ productId: product.id, quantity: 1 }],
    }});
    expect(created.status()).toBe(201);
    const order = await created.json();
    await page.getByRole('button', { name: 'Tra cứu tình trạng đơn hàng', exact:true }).click();
    await page.getByPlaceholder('Nhập Mã Đơn hoặc SĐT...').fill(order.orderNumber);
    await page.getByRole('button', { name: 'Tra Cứu', exact: true }).click();
    page.once('dialog', dialog => dialog.accept());
    const response = page.waitForResponse(r => r.url().includes(`/api/orders/${order.id}/cancel`) && r.request().method() === 'POST');
    await page.getByRole('button', { name: /Hủy Đơn Hàng/ }).click();
    expect((await response).ok()).toBeTruthy();
    await expect(page.getByText('Đơn hàng đã được hủy thành công!')).toBeVisible();
    expect((await (await request.get(`http://localhost:4000/api/orders/${order.id}`)).json()).orderStatus).toBe('CANCELLED');
    const restored = (await (await request.get('http://localhost:4000/api/products?limit=100')).json()).items.find((item:any) => item.id === product.id);
    expect(restored.stockQuantity).toBe(product.stockQuantity);
  });
  test('auth and chat are local UI only: capture absence of API writes', async ({ page }, info) => {
    const writes:string[] = [];
    page.on('request', r => { if (r.url().includes('/api/') && r.method() === 'POST') writes.push(r.url()); });
    await page.getByTestId('btn-customer-login-header').click();
    await page.getByTestId('input-customer-fullname').fill('QA Local Customer');
    await page.getByTestId('input-customer-email').fill('qa-store@example.invalid');
    await page.getByTestId('btn-customer-submit-login').click();
    await expect(page.getByTestId('customer-name-display')).toHaveText('QA Local Customer');
    await page.getByTestId('btn-livechat-bubble').click();
    await page.getByTestId('input-chat-message').fill('QA local-only chat evidence');
    await page.getByTestId('btn-send-chat').click();
    await expect(page.getByTestId('customer-chat-drawer')).toContainText('QA local-only chat evidence');
    expect(writes).toEqual([]);
    await info.attach('integration-limitation', {body:'Login and chat showed success but sent zero API POST requests. UI-only pass, not authentication/messaging integration.',contentType:'text/plain'});
  });
  test('BUG: rejected order must not show checkout success', async ({ page }) => {
    const card = page.locator('#product-catalog [data-sku="NIKON-Z8-BODY"]');
    // Deliberately exceed fixture stock through the actual UI; no API mocking.
    for (let i=0; i<30; i++) await card.getByTestId('btn-quick-add-cart').click();
    await page.getByTestId('btn-cart-drawer').click();
    await page.getByTestId('input-customer-name').fill('QA Rejected Order');
    await page.getByTestId('input-customer-phone').fill('0900000043');
    await page.getByTestId('input-customer-address').fill('QA test address');
    const response = page.waitForResponse(r => r.url().endsWith('/api/orders') && r.request().method() === 'POST');
    await page.getByTestId('btn-submit-order').click();
    expect((await response).status()).toBe(400);
    await expect(page.getByTestId('order-success-modal')).toBeHidden();
  });
});

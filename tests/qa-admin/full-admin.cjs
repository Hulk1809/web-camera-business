// Local disposable-environment audit. Never starts services or targets production.
const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const out = '/tmp/opencode/qa-admin';
fs.mkdirSync(out, { recursive: true });
if (!fs.existsSync('/tmp/opencode/full-qa-environment.json')) throw Error('BLOCKED: environment readiness missing');
const results = [], network = [], errors = [];
const prefix = `QA_ADMIN_${Date.now()}`;
let apiToken = '';
const api = async (path) => (await fetch(`http://localhost:4000/api${path}`, {
  headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : {},
})).json();
const check = (name, ok, evidence) => { results.push({ name, status: ok ? 'PASS' : 'FAIL', evidence }); console.log(name,ok?'PASS':'FAIL', evidence || ''); fs.writeFileSync(`${out}/results.json`,JSON.stringify({prefix,results,network,errors},null,2)); };
(async () => {
 const authResponse = await fetch('http://localhost:4000/api/auth/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'admin@progear.vn',password:'admin123456'})});
 apiToken = (await authResponse.json()).token || '';
 const browser = await chromium.launch({ executablePath: '/usr/bin/microsoft-edge-stable', args: ['--no-sandbox'] });
 const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
 const page = await context.newPage();
 page.setDefaultTimeout(7000);
 page.on('pageerror', e => {errors.push(e.message); console.log('PAGEERROR',e.message);});
 page.on('response', r => { if (r.url().includes('/api/')) network.push({ method: r.request().method(), url: r.url(), status: r.status() }); });
 const id = s => page.getByTestId(s);
 const scenario = async (name, fn) => { try { await fn(); } catch(e) { check(name, false, e.message); await page.screenshot({path: `${out}/${name}-failure.png`, fullPage: true}); await page.reload(); } };
 const login = async (email='admin@progear.vn', password='admin123456') => {
  await page.goto('http://localhost:3001/admin/');
  await id('input-admin-email').fill(email); await id('input-admin-password').fill(password);
  await id('btn-admin-login-submit').click(); await expect(id('nav-dashboard')).toBeVisible();
 };
 let product;
 await scenario('login-navigation', async () => {
  await page.goto('http://localhost:3001/admin/');
  await page.screenshot({path: `${out}/login.png`});
  await id('input-admin-email').fill('admin@progear.vn'); await id('input-admin-password').fill('wrong');
  await id('btn-admin-login-submit').click(); await expect(id('admin-login-error')).toBeVisible();
  check('invalid login rejected', true);
  await id('input-admin-password').fill('admin123456'); await id('btn-admin-login-submit').click();
  await expect(id('nav-dashboard')).toBeVisible(); check('admin login UI', true);
  check('backend authentication performed', network.some(n => /auth.*login/.test(n.url)), network);
  for (const tab of ['dashboard','products','categories','orders','finance','warranty','chat']) {
   await id(`nav-${tab}`).click(); await page.screenshot({path:`${out}/${tab}.png`,fullPage:true});
   check(`navigation ${tab}`, (await page.locator('main').innerText()).length > 100);
  }
 });
 await scenario('product-create', async () => {
  await id('nav-products').click(); await id('btn-open-add-product').click();
  await id('input-product-name').fill(prefix); await id('input-product-sku').fill(prefix);
  await id('input-product-stock').fill('7'); await id('input-product-price').fill('123000');
  await id('tab-prod-images').click();
  await id('input-upload-file').setInputFiles({name:'QA_ADMIN.png', mimeType:'image/png', buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')});
  await expect(id('product-image-preview')).toBeVisible();
  await id('tab-prod-specs').click(); await id('input-spec-sensor').fill('QA_ADMIN_SENSOR');
  await id('btn-add-custom-spec').click(); await page.getByPlaceholder('Tên thông số (VD: Màn hình)').fill('QA_ADMIN_CUSTOM');
  await page.getByPlaceholder('Giá trị (VD: 3.0-inch xoay lật 1.44M điểm ảnh)').fill('QA_ADMIN_VALUE');
  const response = page.waitForResponse(r => r.url().endsWith('/api/products') && r.request().method()==='POST');
  await id('btn-submit-product').click(); const r = await response;
  check('product create API response', r.ok(), {status:r.status(),body:await r.text()});
  product = (await api(`/products?search=${prefix}`)).items[0];
  check('product create persisted', !!product, product);
  check('image and specifications persisted', !!product?.images?.[0]?.imageUrl?.startsWith('data:image/png') && product?.specifications?.sensor==='QA_ADMIN_SENSOR', product);
  const row = page.locator('tr').filter({hasText:prefix});
  await row.getByRole('button',{name:'Sửa',exact:true}).click(); await id('input-product-price').fill('124000');
  const update = page.waitForResponse(r => r.request().method()==='PUT'); await id('btn-submit-product').click(); const ur=await update;
  check('immediate edit uses persisted product ID', ur.ok(), {url:ur.url(),status:ur.status(),body:await ur.text()});
  check('immediate edit persists', Number((await api(`/products?search=${prefix}`)).items[0]?.price)===124000);
 });
 await scenario('product-restock-edit-delete', async () => {
  if(!product) throw Error('Product creation prerequisite missing');
  await page.reload(); await id('nav-products').click();
  const row=page.locator('tr').filter({hasText:prefix}); await expect(row).toBeVisible();
  const update=page.waitForResponse(r=>r.request().method()==='PUT'); await row.getByRole('button',{name:'+5',exact:true}).click(); const r=await update;
  check('restock API',r.ok(),r.status()); check('restock persistence',(await api(`/products?search=${prefix}`)).items[0]?.stockQuantity===12);
  await row.getByRole('button',{name:'Sửa',exact:true}).click(); await id('input-product-price').fill('125000');
  const edit=page.waitForResponse(r=>r.request().method()==='PUT'); await id('btn-submit-product').click(); await edit;
  check('edit after reload persistence',Number((await api(`/products?search=${prefix}`)).items[0]?.price)===125000);
 });
 await scenario('POS-warranty',async()=>{
  if(!product) throw Error('Product creation prerequisite missing');
  await id('btn-open-pos-header').click(); await id('select-pos-product').selectOption(String(product.id));
  await expect(id('input-pos-price')).toHaveValue('125000');
  await id('input-pos-customer-name').fill(prefix); await id('input-pos-customer-phone').fill('0901234567');
  await id('input-pos-custom-serial').fill(prefix);
  const before=network.length; await id('btn-pos-submit').click(); await expect(id('invoice-modal')).toBeVisible();
  const order=await id('invoice-order-number').innerText(); check('POS invoice UI',true,order);
  await page.screenshot({path:`${out}/pos-invoice.png`,fullPage:true});
  check('POS order persisted',(await api('/orders?limit=100')).items.some(o=>o.orderNumber===order),{order,requests:network.slice(before)});
  check('POS stock persisted',(await api(`/products?search=${prefix}`)).items[0]?.stockQuantity===11);
  await page.reload(); await id('nav-warranty').click(); check('warranty local UI',await page.getByText(prefix,{exact:true}).count()>0);
 });
 await scenario('delete',async()=>{
  await id('nav-products').click(); const row=page.locator('tr').filter({hasText:prefix});
  page.once('dialog',d=>d.accept()); const del=page.waitForResponse(r=>r.request().method()==='DELETE');
  await row.getByTitle('Xóa thiết bị').click(); const r=await del;
  check('delete API and persistence',r.ok() && (await api(`/products?search=${prefix}`)).items.length===0,r.status());
 });
 await scenario('staff-role',async()=>{
  await id('btn-admin-logout').click(); await login('tuvan1@progear.vn','progear123');
  check('advisor login UI',true);
  await id('nav-products').click(); check('advisor restricted from product creation',!(await id('btn-open-add-product').isVisible()));
  await id('btn-toggle-staff-switcher').click(); await page.screenshot({path:`${out}/staff-switcher.png`,fullPage:true});
  const buttons=await id('staff-account-switcher').getByRole('button').allTextContents(); check('staff switcher UI',buttons.length>1,buttons);
  await id('staff-account-switcher').getByRole('button').last().click();
  check('staff identity changed',!(await id('btn-toggle-staff-switcher').innerText()).includes('Hoàng Nam'),await id('btn-toggle-staff-switcher').innerText());
 });
 check('no JS page errors',errors.length===0,errors);
 fs.writeFileSync(`${out}/results.json`,JSON.stringify({prefix,results,network,errors},null,2));
 console.log(JSON.stringify(results,null,2)); await browser.close();
})().catch(e=>{ console.error(e); process.exitCode=1; });

const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
const out='/tmp/opencode/qa-admin', results=[], prefix=`QA_ADMIN_${Date.now()}`;
fs.mkdirSync(out,{recursive:true});
if(!fs.existsSync('/tmp/opencode/full-qa-environment.json'))throw Error('Readiness missing');
let token='';
const api=async(path,method='GET',body)=>{const r=await fetch('http://localhost:4000/api'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined}); return {status:r.status,data:await r.json()};};
const save=(name,status,evidence)=>{results.push({name,status,evidence});fs.writeFileSync(out+'/modules.json',JSON.stringify({prefix,results},null,2));console.log(name,status);};
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/microsoft-edge-stable',args:['--no-sandbox']});
const productBody={name:prefix,sku:prefix,price:123000,stockQuantity:9,brand:'Sony',category:'QA_ADMIN_CATEGORY',specifications:{sensor:'QA_ADMIN_SENSOR'},images:['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=']};
const unauth=await api('/products','POST',productBody);
save('Unauthenticated product creation rejected',unauth.status===401||unauth.status===403?'PASS':'FAIL',{status:unauth.status});
const login=await api('/auth/login','POST',{email:'admin@progear.vn',password:'admin123456'});token=login.data.token||'';
save('Backend admin authentication',login.status===201&&!!token?'PASS':'FAIL',{status:login.status,role:login.data.user?.role});
const product=await api('/products','POST',productBody);
const order=await api('/orders','POST',{customerName:prefix,customerPhone:'0901234567',shippingAddress:'QA_ADMIN local only',paymentMethod:'COD',items:[{productId:product.data.id,quantity:1}]});
save('API own fixtures created',product.status===201&&order.status===201?'PASS':'FAIL',{productId:product.data.id,order:order.data});
for(const module of ['dashboard','categories','orders','finance','warranty','chat','pos','role']){
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],requests=[];
 page.setDefaultTimeout(6000);page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/api/'))requests.push({method:r.request().method(),url:r.url(),status:r.status()});});
 const id=s=>page.getByTestId(s);
 try{
  await page.goto('http://localhost:3001/admin/');await id('input-admin-email').fill(module==='role'?'tuvan1@progear.vn':'admin@progear.vn');await id('input-admin-password').fill(module==='role'?'progear123':'admin123456');await id('btn-admin-login-submit').click();await expect(id('nav-dashboard')).toBeVisible();
  // Wait for the real catalog response before opening modules that render it.
  await page.waitForLoadState('networkidle');
  if(module==='pos'){
   await id('btn-open-pos-header').click();await expect(id('select-pos-product')).toBeVisible();
   await id('select-pos-product').selectOption(product.data.id);await id('input-pos-customer-name').fill(prefix);await id('input-pos-customer-phone').fill('0901234567');
   await id('input-pos-custom-serial').fill(prefix);await id('btn-pos-submit').click();await expect(id('invoice-modal')).toBeVisible();
   const number=await id('invoice-order-number').innerText();save('POS invoice UI','PASS',number);
   save('POS order persisted',(await api('/orders?search='+prefix)).data.items.some(o=>o.orderNumber===number)?'PASS':'FAIL',{number,requests});
   save('POS inventory persisted',(await api('/products?search='+prefix)).data.items[0].stockQuantity===7?'PASS':'FAIL');
  }else if(module==='role'){
   save('Advisor restricted from add product',await id('btn-open-add-product').isVisible()?'FAIL':'PASS');
   await id('btn-toggle-staff-switcher').click();await id('staff-account-switcher').getByRole('button').last().click();
   save('Staff switching UI','PASS',await id('btn-toggle-staff-switcher').innerText());
   save('Advisor cannot switch to admin',!(await id('btn-toggle-staff-switcher').innerText()).includes('Quản Trị')?'PASS':'FAIL');
  }else{
   await id('nav-'+module).click();await expect(page.locator('main')).toBeVisible();
   save('Module '+module,errors.length?'FAIL':'PASS',{errors,text:(await page.locator('main').innerText()).slice(0,700)});
   if(module==='orders'){
    const row=page.getByTestId('admin-order-row').filter({hasText:prefix});await expect(row).toBeVisible();await row.getByTestId('btn-view-order').click();
    save('API order visible and details open','PASS');
    const response=page.waitForResponse(r=>r.request().method()==='PATCH');await id('btn-modal-complete-order').click();const r=await response;
    save('Order completion API',r.ok()?'PASS':'FAIL',{status:r.status(),body:await r.text()});
    save('Order status persisted',(await api('/orders/'+order.data.id)).data.orderStatus==='COMPLETED'?'PASS':'FAIL',(await api('/orders/'+order.data.id)).data.orderStatus);
   }
   if(module==='finance'){
    const receipt=page.locator('[data-testid^="btn-view-receipt-"]').first();await receipt.click();await expect(id('modal-receipt-inspection')).toBeVisible();save('Revenue receipt UI','PASS');
   }
   if(module==='chat'){
    await id('tab-chat-waiting').click();await page.locator('[data-testid^="session-item-"]').first().click();await id('btn-admin-claim-chat').click();
    await id('input-admin-chat-message').fill(prefix);await id('btn-admin-send-chat').click();await expect(page.getByText(prefix,{exact:true})).toBeVisible();
    save('Chat claim/send UI','PASS');save('Chat sends to backend',requests.some(r=>r.method==='POST'&&r.url.includes('chat'))?'PASS':'FAIL',requests);
   }
  }
 }catch(e){save('Module '+module,'FAIL',{error:e.message,errors,requests});}
 await page.screenshot({path:out+'/isolated-'+module+'.png',fullPage:true});await context.close();
}
await browser.close();
})();

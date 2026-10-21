// Run explicitly with INVENTORY_TEST_DATABASE_URL pointing to a dedicated local *_test database.
require('ts-node/register');
require('reflect-metadata');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { Module, ValidationPipe } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const { PrismaService } = require('../src/prisma/prisma.service');
const { ProductsService } = require('../src/products/products.service');
const { ProductsController } = require('../src/products/products.controller');
const { OrdersService } = require('../src/orders/orders.service');
const { OrdersController } = require('../src/orders/orders.controller');

const url = new URL(process.env.INVENTORY_TEST_DATABASE_URL || 'http://invalid');
assert.ok(['localhost', '127.0.0.1'].includes(url.hostname) && /_test$/.test(url.pathname),
  'A dedicated local *_test database is required');
const prisma = new PrismaClient({ datasources: { db: { url: url.href } } });
let app, base, category, brand;
const products = [];
before(async () => {
  class TestJwtStrategy extends passport.Strategy {
    constructor() { super(); this.name = 'jwt'; }
    authenticate() { this.success({ id: 'inventory-qa', role: 'ADMIN' }); }
  }
  passport.use('jwt', new TestJwtStrategy());
  await prisma.$connect();
  const suffix = randomUUID();
  category = await prisma.category.create({ data: { name: suffix, slug: suffix } });
  brand = await prisma.brand.create({ data: { name: suffix, slug: suffix } });
  class InventoryModule {}
  Module({ controllers: [ProductsController, OrdersController], providers: [ProductsService,
    OrdersService, { provide: PrismaService, useValue: prisma }] })(InventoryModule);
  app = await NestFactory.create(InventoryModule, { logger: false });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(0, '127.0.0.1');
  base = await app.getUrl();
});
after(async () => {
  await prisma.order.deleteMany({ where: { items: { some: { productId: { in: products } } } } });
  await prisma.product.deleteMany({ where: { id: { in: products } } });
  if (category) await prisma.category.delete({ where: { id: category.id } });
  if (brand) await prisma.brand.delete({ where: { id: brand.id } });
  if (app) await app.close();
  await prisma.$disconnect();
});
async function request(path, body, method = 'POST') {
  const res = await fetch(`${base}/api/${path}`, { method,
    headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
}
function productBody(stockQuantity) {
  const id = randomUUID();
  return { name: id, sku: id, slug: id, price: 100, categoryId: category.id,
    brandId: brand.id, stockQuantity, images: ['original.jpg'] };
}
async function product(stockQuantity) {
  const res = await request('products', productBody(stockQuantity));
  assert.equal(res.status, 201);
  products.push(res.body.id);
  return res.body;
}
const order = items => request('orders', { customerName: 'Inventory QA', customerPhone: '0000000000',
  shippingAddress: 'Test only', paymentMethod: 'COD', items });
const stock = async id => (await prisma.product.findUniqueOrThrow({ where: { id } })).stockQuantity;
const count = id => prisma.order.count({ where: { items: { some: { productId: id } } } });

test('HTTP rejects negative/zero/malformed order quantities without writes', async () => {
  const p = await product(3);
  for (const quantity of [-1, 0, 1.5, '1', null]) {
    assert.equal((await order([{ productId: p.id, quantity }])).status, 400);
  }
  assert.equal(await stock(p.id), 3);
  assert.equal(await count(p.id), 0);
});
test('HTTP preserves zero product stock and rejects negative stock', async () => {
  const p = await product(0);
  assert.equal(await stock(p.id), 0);
  assert.equal((await order([{ productId: p.id, quantity: 1 }])).status, 400);
  const invalid = productBody(-1);
  assert.equal((await request('products', invalid)).status, 400);
  assert.equal(await prisma.product.count({ where: { sku: invalid.sku } }), 0);
});
test('HTTP rejects inactive product without inventory/order mutation', async () => {
  const p = await product(2);
  assert.equal((await request(`products/${p.id}`, { isActive: false }, 'PUT')).status, 200);
  assert.equal((await order([{ productId: p.id, quantity: 1 }])).status, 404);
  assert.equal(await stock(p.id), 2);
  assert.equal(await count(p.id), 0);
});
test('two concurrent HTTP orders for stock 1 create exactly one persisted order', async () => {
  const p = await product(1);
  const responses = await Promise.all([order([{ productId: p.id, quantity: 1 }]),
    order([{ productId: p.id, quantity: 1 }])]);
  assert.deepEqual(responses.map(r => r.status).sort(), [201, 400]);
  assert.equal(await stock(p.id), 0);
  assert.equal(await count(p.id), 1);
  const saved = await prisma.order.findUniqueOrThrow({ where: { id: responses.find(r => r.status === 201).body.id }, include: { items: true } });
  assert.equal(saved.totalAmount, 100);
  assert.equal(saved.items.length, 1);
  assert.equal(saved.items[0].quantity, 1);
});
test('insufficient later item rolls back earlier reservation and all order writes', async () => {
  const first = await product(2), second = await product(0);
  assert.equal((await order([{ productId: first.id, quantity: 1 }, { productId: second.id, quantity: 1 }])).status, 400);
  assert.equal(await stock(first.id), 2);
  assert.equal(await stock(second.id), 0);
  assert.equal(await count(first.id), 0);
  assert.equal(await prisma.orderItem.count({ where: { productId: first.id } }), 0);
});
test('update rejects invalid stock before replacing images; zero remains valid', async () => {
  const p = await product(2);
  for (const stockQuantity of [-1, 1.5, '2', null, { decrement: 5 }]) {
    assert.equal((await request(`products/${p.id}`, { stockQuantity, images: ['changed.jpg'] }, 'PUT')).status, 400);
    assert.equal(await stock(p.id), 2);
    assert.deepEqual((await prisma.productImage.findMany({ where: { productId: p.id } })).map(i => i.imageUrl), ['original.jpg']);
  }
  assert.equal((await request(`products/${p.id}`, { stockQuantity: 0 }, 'PUT')).status, 200);
  assert.equal(await stock(p.id), 0);
});

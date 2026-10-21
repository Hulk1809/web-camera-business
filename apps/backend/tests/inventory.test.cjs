require('ts-node/register');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { OrdersService } = require('../src/orders/orders.service');
const { ProductsService } = require('../src/products/products.service');

test('rejects malformed order items before accessing inventory', async () => {
  const service = new OrdersService({
    $transaction() { assert.fail('Invalid orders must not access inventory'); },
  });
  for (const items of [null, {}, [], [null], [{ productId: '' , quantity: 1 }],
    ...[-1, 0, 1.5, '2', NaN, Infinity].map(quantity => [{ productId: 'camera', quantity }])]) {
    await assert.rejects(service.create({ items }), error => error.getStatus() === 400);
  }
});

test('only one concurrent buyer can reserve the last camera', async () => {
  let stock = 1;
  const orders = [];
  const tx = {
    product: {
      async findUnique() {
        return { id: 'camera', name: 'Camera', sku: 'CAM', price: 100, stockQuantity: stock, isActive: true };
      },
      async updateMany({ where, data }) {
        if (stock < where.stockQuantity.gte) return { count: 0 };
        stock -= data.stockQuantity.decrement;
        return { count: 1 };
      },
    },
    order: { async create({ data }) { orders.push(data); return data; } },
  };
  const service = new OrdersService({ $transaction: callback => callback(tx) });
  const results = await Promise.allSettled([
    service.create({ items: [{ productId: 'camera', quantity: 1 }] }),
    service.create({ items: [{ productId: 'camera', quantity: 1 }] }),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.find(result => result.status === 'rejected').reason.getStatus(), 400);
  assert.equal(stock, 0);
  assert.equal(orders.length, 1);
  assert.equal(orders[0].totalAmount, 100);
});

test('inactive products cannot be ordered', async () => {
  const service = new OrdersService({ $transaction: callback => callback({
    product: { async findUnique() { return { isActive: false }; } },
  }) });
  await assert.rejects(service.create({ items: [{ productId: 'camera', quantity: 1 }] }),
    error => error.getStatus() === 404);
});

test('creating a product preserves zero stock and validates quantities', async () => {
  const service = new ProductsService({ product: { async create({ data }) { return data; } } });
  const base = { categoryId: 1, brandId: 1, name: 'Camera' };
  assert.equal((await service.create({ ...base, stockQuantity: 0, stock: 5 })).stockQuantity, 0);
  assert.equal((await service.create({ ...base, stock: 0 })).stockQuantity, 0);
  assert.equal((await service.create(base)).stockQuantity, 10);
  for (const stockQuantity of [-1, 1.5, 'invalid', Infinity]) {
    await assert.rejects(service.create({ ...base, stockQuantity }), error => error.getStatus() === 400);
  }
});

test('updating a product rejects invalid stock before changing product or images', async () => {
  const service = new ProductsService({
    product: { async update({ data }) { return data; } },
    productImage: { async deleteMany() { assert.fail('Invalid stock must not change images'); } },
  });
  for (const stockQuantity of [-1, 1.5, '2', null, { decrement: 5 }, NaN, Infinity]) {
    await assert.rejects(service.update('camera', { stockQuantity, images: ['camera.jpg'] }),
      error => error.getStatus() === 400);
  }
  assert.deepEqual(await service.update('camera', { stockQuantity: 0 }), { stockQuantity: 0 });
  assert.deepEqual(await service.update('camera', { stockQuantity: 5 }), { stockQuantity: 5 });
  assert.deepEqual(await service.update('camera', { name: 'New name' }), { name: 'New name' });
});

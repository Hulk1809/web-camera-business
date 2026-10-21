require('ts-node/register');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ChatService } = require('../src/chat/chat.service');
const { CustomerChatController } = require('../src/chat/chat.controller');

test('customer cannot read a session owned by another token', async () => {
  const prisma = {
    chatCustomer: { findUnique: async () => ({ id: 'customer-a' }) },
    chatSession: { findFirst: async ({ where }) => {
      assert.equal(where.customerId, 'customer-a');
      return null;
    } },
  };
  const service = new ChatService(prisma);
  await assert.rejects(service.getCustomerSession('opaque-token-that-is-long-enough', 'other-session', {}),
    error => error.getStatus() === 404);
});

test('claim uses a conditional update and rejects an already claimed session', async () => {
  const tx = {
    chatSession: {
      async updateMany({ where }) {
        assert.equal(where.assignedUserId, null);
        assert.equal(where.status, 'WAITING');
        return { count: 0 };
      },
      async findUnique() { return { assignedUserId: 'staff-b' }; },
    },
  };
  const service = new ChatService({ $transaction: callback => callback(tx) });
  await assert.rejects(service.claim('session', 'staff-a'), error => error.getStatus() === 409);
});

test('staff must claim a session before replying', async () => {
  const service = new ChatService({
    chatSession: { findUnique: async () => ({ assignedUserId: 'staff-b', status: 'ACTIVE' }) },
  });
  await assert.rejects(service.sendAdminMessage('session', 'staff-a', 'Hello'),
    error => error.getStatus() === 403);
});

test('customer controller forwards the opaque token when listing sessions', async () => {
  const chat = {
    async listCustomerSessions(token) {
      assert.equal(token, 'customer-secret-token');
      return [{ id: 'session' }];
    },
  };
  const controller = new CustomerChatController(chat);
  assert.deepEqual(await controller.list('customer-secret-token'), [{ id: 'session' }]);
});

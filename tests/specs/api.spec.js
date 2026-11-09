const { test, expect } = require('@playwright/test');
const { loadConfig } = require('../../src/config/loadConfig');

test.describe('Shop API', () => {
  test('returns the catalog and a filtered search', async ({ request }) => {
    const all = await request.get('/api/products');
    expect(all.ok()).toBeTruthy();
    const catalog = await all.json();
    expect(catalog.products.map((product) => product.name)).toEqual([
      'Aurora Lamp',
      'Cobalt Mug',
      'Nimbus Notebook'
    ]);

    const filtered = await request.get('/api/products?q=mug');
    const matches = await filtered.json();
    expect(matches.products).toEqual([
      expect.objectContaining({ id: 'cobalt-mug', price: 18 })
    ]);
  });

  test('authenticates the configured user and rejects everyone else', async ({ request }) => {
    const config = loadConfig();
    const ok = await request.post('/api/login', { data: config.users.valid });
    expect(ok.ok()).toBeTruthy();
    expect(await ok.json()).toEqual({ name: 'Ada Lovelace', email: config.users.valid.email });

    const denied = await request.post('/api/login', { data: config.users.invalid });
    expect(denied.status()).toBe(401);
  });
});

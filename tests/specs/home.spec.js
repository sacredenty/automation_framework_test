const { test, expect } = require('../fixtures');

test.describe('Catalog', () => {
  test('shows the shop heading and every product', async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.heading).toHaveText('Widgets worth keeping');
    await expect(homePage.product('Aurora Lamp')).toBeVisible();
    await expect(homePage.product('Cobalt Mug')).toBeVisible();
    await expect(homePage.product('Nimbus Notebook')).toBeVisible();
  });

  test('filters the catalog from the search box', async ({ homePage }) => {
    await homePage.open();
    await homePage.search('lamp');
    await expect(homePage.product('Aurora Lamp')).toBeVisible();
    await expect(homePage.product('Cobalt Mug')).toHaveCount(0);
    await expect(homePage.page).toHaveURL(/q=lamp/);
  });

  test('shows an empty state when nothing matches', async ({ homePage }) => {
    await homePage.open();
    await homePage.search('nothing-like-this');
    await expect(homePage.emptyState).toBeVisible();
    await expect(homePage.catalog.getByRole('heading')).toHaveCount(0);
  });
});

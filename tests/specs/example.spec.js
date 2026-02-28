const { test, expect } = require('@playwright/test');
const { PageObject } = require('../../utils/PageObject');

test.describe('Example Tests', () => {
  test('should load homepage', async ({ page }) => {
    const pageObject = new PageObject(page);
    await pageObject.navigateTo('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('should search for content', async ({ page }) => {
    const pageObject = new PageObject(page);
    await pageObject.navigateTo('https://example.com');
    await pageObject.waitForElement('h1');
    const title = await pageObject.getText('h1');
    expect(title).toContain('Example');
  });
});

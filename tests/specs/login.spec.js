const { test, expect } = require('../fixtures');

test.describe('Sign in', () => {
  test('signs in with the configured user and can log out', async ({ loginPage, accountPage, frameworkConfig }) => {
    await loginPage.open();
    await loginPage.loginAs(frameworkConfig.users.valid);

    await expect(accountPage.heading).toBeVisible();
    await expect(accountPage.greeting).toHaveText('Signed in as Ada Lovelace');

    await accountPage.logout.click();
    await expect(loginPage.page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });

  test('rejects a bad password', async ({ loginPage, frameworkConfig }) => {
    await loginPage.open();
    await loginPage.loginAs(frameworkConfig.users.invalid);
    await expect(loginPage.error).toHaveText('Email or password is incorrect.');
    await expect(loginPage.heading).toBeVisible();
  });

  test('sends anonymous visitors from account back to sign in', async ({ page }) => {
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});

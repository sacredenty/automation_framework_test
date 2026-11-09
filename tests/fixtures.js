const { test: base, expect } = require('@playwright/test');
const { loadConfig } = require('../src/config/loadConfig');
const { HomePage } = require('../src/pages/HomePage');
const { LoginPage } = require('../src/pages/LoginPage');
const { AccountPage } = require('../src/pages/AccountPage');

const test = base.extend({
  frameworkConfig: async ({}, use) => { // eslint-disable-line no-empty-pattern -- Playwright fixture with no dependencies
    await use(loadConfig());
  },
  homePage: async ({ page, frameworkConfig }, use) => {
    await use(new HomePage(page, frameworkConfig));
  },
  loginPage: async ({ page, frameworkConfig }, use) => {
    await use(new LoginPage(page, frameworkConfig));
  },
  accountPage: async ({ page, frameworkConfig }, use) => {
    await use(new AccountPage(page, frameworkConfig));
  }
});

module.exports = { test, expect };

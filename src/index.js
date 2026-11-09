const { TestRunner } = require('./core/TestRunner');
const { BrowserManager } = require('./core/BrowserManager');
const { loadConfig } = require('./config/loadConfig');
const { BasePage } = require('./pages/BasePage');
const { HomePage } = require('./pages/HomePage');
const { LoginPage } = require('./pages/LoginPage');
const { AccountPage } = require('./pages/AccountPage');

module.exports = {
  TestRunner,
  BrowserManager,
  loadConfig,
  BasePage,
  HomePage,
  LoginPage,
  AccountPage
};

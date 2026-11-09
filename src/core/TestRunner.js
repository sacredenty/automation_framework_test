const { BrowserManager } = require('./BrowserManager');
const { loadConfig } = require('../config/loadConfig');
const logger = require('../../utils/logger');

/**
 * Optional programmatic runner for scripts that are not Playwright Test specs.
 * Specs under tests/ should use the fixtures in tests/fixtures.js instead.
 */
class TestRunner {
  constructor(config = loadConfig()) {
    this.config = config;
    this.browserManager = new BrowserManager();
    this.testResults = [];
  }

  async runTestSuite(testConfig = {}) {
    const browserType = testConfig.browserType || this.config.browser;
    const tests = testConfig.tests || [];
    const options = {
      headless: this.config.headless,
      ...(testConfig.options || {})
    };
    const contextOptions = {
      baseURL: this.config.baseUrl,
      ...(testConfig.contextOptions || {})
    };

    logger.info(`Starting test suite with ${tests.length} tests on ${browserType}`);
    const { browserId } = await this.browserManager.launchBrowser(browserType, options);
    const { contextId } = await this.browserManager.createContext(browserId, contextOptions);

    try {
      for (const testSpec of tests) {
        await this.runSingleTest(testSpec, contextId);
      }
    } finally {
      await this.browserManager.closeBrowser(browserId);
    }

    return this.testResults;
  }

  async runSingleTest(testSpec, contextId) {
    const { page } = await this.browserManager.createPage(contextId);
    const startTime = Date.now();
    const result = { name: testSpec.name, status: 'passed', error: null, duration: 0 };

    try {
      await testSpec.execute(page, this.config);
      logger.info(`Test passed: ${testSpec.name}`);
    } catch (error) {
      result.status = 'failed';
      result.error = error.message;
      logger.error(`Test failed: ${testSpec.name} - ${error.message}`);
    } finally {
      result.duration = Date.now() - startTime;
      this.testResults.push(result);
      await page.close();
    }

    return result;
  }
}

module.exports = { TestRunner };

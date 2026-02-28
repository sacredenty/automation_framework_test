const { test, expect } = require('@playwright/test');
const { BrowserManager } = require('./BrowserManager');
const logger = require('../../utils/logger');

class TestRunner {
  constructor() {
    this.browserManager = new BrowserManager();
    this.testResults = [];
  }

  async runTestSuite(testConfig) {
    const { browserType = 'chromium', tests, options = {} } = testConfig;
    
    logger.info(`Starting test suite with ${tests.length} tests`);
    
    const { browserId } = await this.browserManager.launchBrowser(browserType, options);
    const { contextId } = await this.browserManager.createContext(browserId);
    
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
    const { pageId, page } = await this.browserManager.createPage(contextId);
    const startTime = Date.now();
    let result = { name: testSpec.name, status: 'passed', error: null, duration: 0 };
    
    try {
      await testSpec.execute(page);
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
  }
}

module.exports = { TestRunner };

const { chromium, firefox, webkit } = require('playwright');
const logger = require('../utils/logger');

class BrowserManager {
  constructor() {
    this.browsers = new Map();
    this.contexts = new Map();
    this.pages = new Map();
  }

  async launchBrowser(browserType = 'chromium', options = {}) {
    const browserId = `${browserType}_${Date.now()}`;
    
    try {
      let browser;
      switch (browserType.toLowerCase()) {
        case 'chromium':
          browser = await chromium.launch(options);
          break;
        case 'firefox':
          browser = await firefox.launch(options);
          break;
        case 'webkit':
          browser = await webkit.launch(options);
          break;
        default:
          throw new Error(`Unsupported browser type: ${browserType}`);
      }
      
      this.browsers.set(browserId, browser);
      logger.info(`Browser launched: ${browserType} with ID: ${browserId}`);
      return { browserId, browser };
    } catch (error) {
      logger.error(`Failed to launch browser: ${error.message}`);
      throw error;
    }
  }

  async createContext(browserId, contextOptions = {}) {
    const browser = this.browsers.get(browserId);
    if (!browser) {
      throw new Error(`Browser with ID ${browserId} not found`);
    }
    
    const context = await browser.newContext(contextOptions);
    const contextId = `${browserId}_context_${Date.now()}`;
    this.contexts.set(contextId, context);
    logger.info(`Context created: ${contextId}`);
    return { contextId, context };
  }

  async createPage(contextId) {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context with ID ${contextId} not found`);
    }
    
    const page = await context.newPage();
    const pageId = `${contextId}_page_${Date.now()}`;
    this.pages.set(pageId, page);
    logger.info(`Page created: ${pageId}`);
    return { pageId, page };
  }

  async closeBrowser(browserId) {
    const browser = this.browsers.get(browserId);
    if (browser) {
      await browser.close();
      this.browsers.delete(browserId);
      logger.info(`Browser closed: ${browserId}`);
    }
  }

  async closeAllBrowsers() {
    const closePromises = Array.from(this.browsers.values()).map(browser => browser.close());
    await Promise.all(closePromises);
    this.browsers.clear();
    this.contexts.clear();
    this.pages.clear();
    logger.info('All browsers closed');
  }
}

module.exports = { BrowserManager };

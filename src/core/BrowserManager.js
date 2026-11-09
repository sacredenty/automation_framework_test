const { chromium, firefox, webkit } = require('playwright');
const logger = require('../../utils/logger');

const LAUNCHERS = { chromium, firefox, webkit };

class BrowserManager {
  constructor() {
    this.browsers = new Map();
    this.contexts = new Map();
    this.pages = new Map();
  }

  async launchBrowser(browserType = 'chromium', options = {}) {
    const launcher = LAUNCHERS[browserType.toLowerCase()];
    if (!launcher) {
      throw new Error(`Unsupported browser type: ${browserType}`);
    }

    const browserId = `${browserType}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    try {
      const browser = await launcher.launch(options);
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
    this.contexts.set(contextId, { context, browserId });
    logger.info(`Context created: ${contextId}`);
    return { contextId, context };
  }

  async createPage(contextId) {
    const entry = this.contexts.get(contextId);
    if (!entry) {
      throw new Error(`Context with ID ${contextId} not found`);
    }

    const page = await entry.context.newPage();
    const pageId = `${contextId}_page_${Date.now()}`;
    this.pages.set(pageId, { page, contextId });
    logger.info(`Page created: ${pageId}`);
    return { pageId, page };
  }

  async closeBrowser(browserId) {
    const browser = this.browsers.get(browserId);
    if (!browser) return;

    for (const [pageId, entry] of this.pages) {
      if (entry.contextId.startsWith(browserId)) this.pages.delete(pageId);
    }
    for (const [contextId, entry] of this.contexts) {
      if (entry.browserId === browserId) this.contexts.delete(contextId);
    }

    await browser.close();
    this.browsers.delete(browserId);
    logger.info(`Browser closed: ${browserId}`);
  }

  async closeAllBrowsers() {
    await Promise.all(Array.from(this.browsers.values()).map((browser) => browser.close()));
    this.browsers.clear();
    this.contexts.clear();
    this.pages.clear();
    logger.info('All browsers closed');
  }
}

module.exports = { BrowserManager };

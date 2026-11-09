class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {object} [config]
   */
  constructor(page, config = {}) {
    this.page = page;
    this.config = config;
  }

  async open(route = '/') {
    await this.page.goto(route);
  }

  async takeScreenshot(fileName) {
    await this.page.screenshot({ path: `reports/screenshots/${fileName}`, fullPage: true });
  }
}

module.exports = { BasePage };

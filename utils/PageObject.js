class PageObject {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url);
  }

  async clickElement(selector) {
    await this.page.click(selector);
  }

  async typeText(selector, text) {
    await this.page.fill(selector, text);
  }

  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  async takeScreenshot(fileName) {
    await this.page.screenshot({ path: `reports/screenshots/${fileName}` });
  }
}

module.exports = { PageObject };

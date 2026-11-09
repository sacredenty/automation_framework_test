const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page, config) {
    super(page, config);
    this.heading = page.getByRole('heading', { level: 1 });
    this.catalog = page.getByRole('list', { name: 'Catalog' });
    this.searchInput = page.getByLabel('Search the catalog');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.accountLink = page.getByRole('link', { name: 'Account' });
    this.emptyState = page.getByText('No widgets match that search.');
  }

  async open() {
    await super.open('/');
  }

  async search(query) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  product(name) {
    return this.catalog.getByRole('heading', { name, level: 2 });
  }
}

module.exports = { HomePage };

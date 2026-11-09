const { BasePage } = require('./BasePage');

class AccountPage extends BasePage {
  constructor(page, config) {
    super(page, config);
    this.heading = page.getByRole('heading', { name: 'Your account' });
    this.greeting = page.getByTestId('account-greeting');
    this.logout = page.getByRole('button', { name: 'Log out' });
  }

  async open() {
    await super.open('/account');
  }
}

module.exports = { AccountPage };

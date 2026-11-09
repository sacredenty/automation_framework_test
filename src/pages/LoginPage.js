const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page, config) {
    super(page, config);
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Sign in' });
    this.error = page.getByRole('alert');
    this.heading = page.getByRole('heading', { name: 'Sign in' });
  }

  async open() {
    await super.open('/login');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  async loginAs(user = this.config.users?.valid) {
    await this.login(user.email, user.password);
  }
}

module.exports = { LoginPage };

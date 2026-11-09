const assert = require('assert');
const { loadConfig } = require('../../src/config/loadConfig');

const config = loadConfig();
assert.strictEqual(config.baseUrl, 'http://127.0.0.1:4173');
assert.strictEqual(config.demo.port, 4173);
assert.strictEqual(config.users.valid.email, 'ada@example.com');
assert.ok(['chromium', 'firefox', 'webkit'].includes(config.browser));

const previous = process.env.BASE_URL;
process.env.BASE_URL = 'http://127.0.0.1:9999/';
const overridden = loadConfig();
assert.strictEqual(overridden.baseUrl, 'http://127.0.0.1:9999');
if (previous === undefined) delete process.env.BASE_URL;
else process.env.BASE_URL = previous;

console.log('config unit checks passed');

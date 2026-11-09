const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('lodash');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const ROOT = path.resolve(__dirname, '../..');
const JSON_PATH = path.join(ROOT, 'config', 'test-config.json');
const YAML_PATH = path.join(ROOT, 'config', 'test-config.yaml');

const DEFAULTS = {
  browser: 'chromium',
  headless: true,
  timeout: 30000,
  retries: 0,
  workers: undefined,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
  baseUrl: 'http://127.0.0.1:4173',
  demo: {
    port: 4173,
    host: '127.0.0.1'
  },
  users: {
    valid: { email: 'ada@example.com', password: 'lightning' },
    invalid: { email: 'ada@example.com', password: 'wrong-password' }
  }
};

function readIfExists(filePath, parser) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return parser(fs.readFileSync(filePath, 'utf8'));
}

function envOverrides() {
  const overrides = {};
  if (process.env.BROWSER) overrides.browser = process.env.BROWSER;
  if (process.env.HEADLESS !== undefined) {
    overrides.headless = process.env.HEADLESS !== 'false';
  }
  if (process.env.TIMEOUT) overrides.timeout = Number(process.env.TIMEOUT);
  if (process.env.RETRIES) overrides.retries = Number(process.env.RETRIES);
  if (process.env.BASE_URL) overrides.baseUrl = process.env.BASE_URL;
  if (process.env.DEMO_PORT || process.env.DEMO_HOST) {
    overrides.demo = {};
    if (process.env.DEMO_PORT) overrides.demo.port = Number(process.env.DEMO_PORT);
    if (process.env.DEMO_HOST) overrides.demo.host = process.env.DEMO_HOST;
  }
  return overrides;
}

function loadConfig() {
  const fromJson = readIfExists(JSON_PATH, JSON.parse);
  const fromYaml = readIfExists(YAML_PATH, (raw) => yaml.load(raw) || {});
  const config = _.merge({}, DEFAULTS, fromJson, fromYaml, envOverrides());
  config.baseUrl = config.baseUrl.replace(/\/$/, '');
  return config;
}

module.exports = { loadConfig, ROOT };

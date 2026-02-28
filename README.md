# Frontend Automation Framework

A comprehensive frontend automation framework built with Playwright for cross-browser web testing.

## Features
- Cross-browser support (Chrome, Firefox, Safari)
- Page Object Model pattern
- Built-in reporting and logging
- Screenshot and video capture
- Parallel test execution

## Installation
```bash
npm install
npm run install:browsers
```

## Usage
### Run Tests
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

### Framework API
```javascript
const { TestRunner, BrowserManager } = require('./src/index.js');

// Initialize test runner
const testRunner = new TestRunner();
```

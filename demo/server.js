const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../src/config/loadConfig');
const { searchProducts, authenticate } = require('./catalog');

const PUBLIC_DIR = path.join(__dirname, 'public');

function send(res, status, body, type = 'text/html; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), 'application/json; charset=utf-8');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function publicFile(urlPath) {
  const relative = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
  const filePath = path.normalize(path.join(PUBLIC_DIR, relative));
  if (!filePath.startsWith(PUBLIC_DIR)) return null;
  return filePath;
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');

    try {
      if (req.method === 'GET' && url.pathname === '/api/products') {
        return sendJson(res, 200, { products: searchProducts(url.searchParams.get('q') || '') });
      }

      if (req.method === 'POST' && url.pathname === '/api/login') {
        const body = await readBody(req);
        const user = authenticate(body.email, body.password);
        if (!user) return sendJson(res, 401, { error: 'Email or password is incorrect.' });
        return sendJson(res, 200, { name: user.name, email: user.email });
      }

      if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/login' || url.pathname === '/account')) {
        return send(res, 200, fs.readFileSync(path.join(PUBLIC_DIR, 'index.html')));
      }

      if (req.method === 'GET') {
        const filePath = publicFile(url.pathname);
        if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const type = filePath.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8';
          return send(res, 200, fs.readFileSync(filePath), type);
        }
      }

      send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
  });
}

function startServer(options = {}) {
  const config = loadConfig();
  const host = options.host || config.demo.host;
  const port = options.port || config.demo.port;
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(port, host, () => resolve(server));
  });
}

if (require.main === module) {
  startServer().then((server) => {
    const address = server.address();
    console.log(`Demo shop listening on http://${address.address}:${address.port}`);
  });
}

module.exports = { createServer, startServer };

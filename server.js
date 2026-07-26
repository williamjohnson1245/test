'use strict';

const http = require('http');

const HOST = '0.0.0.0';
const PORT = Number.parseInt(process.env.PORT || '10000', 10);
const TARGET_URL = process.env.TARGET_URL || 'https://example.com';
const REDIRECT_STATUS = Number.parseInt(process.env.REDIRECT_STATUS || '302', 10);

const ALLOWED_STATUSES = new Set([301, 302, 303, 307, 308]);

function validateConfig() {
  let target;

  try {
    target = new URL(TARGET_URL);
  } catch {
    throw new Error('TARGET_URL must be a valid absolute URL.');
  }

  if (target.protocol !== 'https:') {
    throw new Error('TARGET_URL must use HTTPS.');
  }

  if (!ALLOWED_STATUSES.has(REDIRECT_STATUS)) {
    throw new Error(
      `REDIRECT_STATUS must be one of: ${[...ALLOWED_STATUSES].join(', ')}`
    );
  }

  return target.toString();
}

let redirectTarget;

try {
  redirectTarget = validateConfig();
} catch (error) {
  console.error(`Configuration error: ${error.message}`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  // Render health check endpoint: does not redirect.
  if (requestUrl.pathname === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Fixed server-side redirect. The destination cannot be changed via query parameters.
  res.writeHead(REDIRECT_STATUS, {
    Location: redirectTarget,
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  });
  res.end(`Redirecting to ${redirectTarget}\n`);
});

server.listen(PORT, HOST, () => {
  console.log(`Redirect service listening on http://${HOST}:${PORT}`);
  console.log(`Redirect target: ${redirectTarget}`);
  console.log(`HTTP status: ${REDIRECT_STATUS}`);
});

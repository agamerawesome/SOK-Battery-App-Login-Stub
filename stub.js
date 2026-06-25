const http = require('http');
const jwt = require('jsonwebtoken');

// List of JWT secrets to try (most likely candidates)
const secrets = [
  'hdg',
  'secret',
  'key',
  'password',
  '12345678901234567890123456789012',
  'sok-battery-secret-key-2024',
  'xiantao-secret',
  ''  // empty secret
];

// Cache a valid token you captured
let capturedToken = null;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, tk, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const url = req.url.toLowerCase();
    
    console.log(`\n${req.method} ${req.url}`);
    if (body) console.log('Body:', body.substring(0, 200));

    // Verification code request
    if (url.includes('/getrandomcode/')) {
      res.writeHead(200);
      res.end(JSON.stringify({
        code: 200,
        msg: 'Verification code sent',
        data: null
      }));
    }

    // Register
    else if (url.includes('/user/register') && req.method === 'POST') {
      try {
        const payload = JSON.parse(body);
        const userId = Math.floor(Math.random() * 100000);

        // Try to generate a token with each secret
        let token = null;
        for (const secret of secrets) {
          try {
            token = jwt.sign(
              { exp: Math.floor(Date.now() / 1000) + 31536000, role: 0, user_id: userId },
              secret,
              { algorithm: 'HS256' }
            );
            console.log(`✓ Token generated with secret: "${secret}"`);
            break;
          } catch (e) {
            // Try next secret
          }
        }

        if (!token) {
          // Fallback: just return the captured token (token replay)
          token = capturedToken || 'mock-token-' + Date.now();
        }

        res.writeHead(200);
        res.end(JSON.stringify({
          code: 200,
          msg: 'success',
          data: {
            countryCode: payload.data?.countryCode || '1',
            countryName: payload.data?.countryName || 'America',
            email: payload.data?.email || 'local@test.com',
            language: '',
            nickName: '',
            phoneId: payload.data?.phoneId || 'local-device',
            phoneModelName: payload.data?.phoneModelName || 'LocalTest',
            timezoneId: '',
            tk: token
          }
        }));
      } catch (e) {
        console.error('Register error:', e.message);
        res.writeHead(400);
        res.end(JSON.stringify({ code: 400, msg: 'error' }));
      }
    }

    // Login
    else if (url.includes('/user/login') && req.method === 'POST') {
      try {
        const payload = JSON.parse(body);
        
        let token = null;
        for (const secret of secrets) {
          try {
            token = jwt.sign(
              { exp: Math.floor(Date.now() / 1000) + 31536000, role: 0, user_id: 999 },
              secret,
              { algorithm: 'HS256' }
            );
            break;
          } catch (e) {
            // Try next
          }
        }

        if (!token) token = capturedToken || 'mock-token-' + Date.now();

        res.writeHead(200);
        res.end(JSON.stringify({
          code: 0,
          msg: 'success',
          data: {
            email: payload.data?.email || 'local@test.com',
            tk: token
          }
        }));
        console.log('✓ Login successful');
      } catch (e) {
        console.error('Login error:', e.message);
        res.writeHead(400);
        res.end(JSON.stringify({ code: 400, msg: 'error' }));
      }
    }

    // Catch all other endpoints
    else {
      res.writeHead(200);
      res.end(JSON.stringify({ code: 0, msg: 'mock', data: {} }));
    }
  });
});

server.listen(8080, '0.0.0.0', () => {
  console.log('SOK BMS Mock Server running on :8080');
  console.log('Trying JWT secrets:', secrets.map(s => `"${s}"`).join(', '));
});
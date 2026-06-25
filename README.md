# SOK Battery Stub

Node.js stub server that bypasses cloud login on the SOK Battery app (`com.sok.batterypacks`). Run locally to use the app offline without sending credentials to Tencent.

## Setup

### 1. Install Node.js
- **Windows:** https://nodejs.org/ (LTS)
- **Linux:** `sudo apt install nodejs npm`

### 2. Run the Stub
```bash
npm install jsonwebtoken
node stub.js
```

### 3. Redirect Traffic in Your Router

Redirect these IPs to your stub server on port 8080:
- `43.130.36.6:8080`
- `43.135.175.32:8080`

**MikroTik example:**
```bash
/ip firewall nat add chain=dstnat protocol=tcp dst-address=43.130.36.6 \
  dst-port=8080 action=dst-nat to-addresses=<stub-ip> to-ports=8080
/ip firewall nat add chain=dstnat protocol=tcp dst-address=43.135.175.32 \
  dst-port=8080 action=dst-nat to-addresses=<stub-ip> to-ports=8080
```

### 4. Use the App

On your Android phone connected to your network:
1. Open **SOK Battery** app
2. Register or Login with any email/password
3. Done—you're logged in locally without cloud

## What It Does

- Intercepts login/register requests
- Returns valid JWT tokens for any credentials
- Keeps your battery data local, not on Tencent's servers

## Troubleshooting

**Port 8080 already in use?**
Edit `stub.js` line with `.listen(8080,` and change to a different port.

**App still connects to real server?**
- Verify router redirect is active
- Check firewall isn't blocking port 8080
- Restart the app

## License

MIT

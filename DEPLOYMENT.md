# VPS Deployment Guide

## Prerequisites on VPS
- Node.js (v16+)
- PM2 (process manager)
- nginx (already installed)

## Installation Commands for VPS

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Clone the repository
git clone https://github.com/your-username/projectdownloader.git
cd projectdownloader

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Build the frontend for production
npm run build
```

## Configuration

### 1. Update File Paths
Edit `server/index.js` and update the `FILE_PATHS` with your actual VPS paths:

```javascript
const FILE_PATHS = {
  'rbs-modump-sunset': '/home/youruser/dumps/rbs-modump-sunset',
  'rnc-modump-sunset': '/home/youruser/dumps/rnc-modump-sunset',
  'migration-modump': '/home/youruser/dumps/migration-modump',
  'allip-bsc': '/home/youruser/dumps/allip-bsc'
};
```

### 2. Update API URL for Production
Edit `src/services/fileService.ts`:

```typescript
const API_CONFIG = {
  baseUrl: 'http://your-vps-ip:3001', // or use your domain
  // ...
};
```

## Running with PM2

```bash
# Start the API server with PM2
pm2 start server/index.js --name "file-api"

# Start PM2 on system boot
pm2 startup
pm2 save
```

## nginx Configuration

Add this to your nginx config to proxy the API and serve the frontend.

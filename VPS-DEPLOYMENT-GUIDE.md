# 🚀 VPS Deployment Guide for File Manager

## Overview
This guide will help you deploy your File Manager project to your VPS alongside your existing nginx + Streamlit setup.

## 🔧 Prerequisites on VPS
- Ubuntu/Debian VPS
- nginx (already running)
- Node.js 16+ 
- PM2 process manager
- Git (for GitHub integration)

## 📋 Step-by-Step Deployment

#### **1. Push to GitHub:**
```bash
# Create a new repository on GitHub, then:
cd /Users/wisbay/Documents/Programming/projectdownloader
git remote add origin https://github.com/YOUR_USERNAME/file-manager.git
git branch -M main
git push -u origin main
```

#### **2. On Your VPS (dump.wisbay.my.id):**
```bash
# Install Node.js and PM2 (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and deploy
git clone https://github.com/YOUR_USERNAME/file-manager.git
cd file-manager
npm install
cd server && npm install && cd ..
npm run build
./deploy.sh
```

#### **3. Update nginx config** for dump.wisbay.my.id with the provided configuration

### 2. **Prepare VPS Environment**
SSH into your VPS and run:

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create directories
sudo mkdir -p /var/www/file-manager
sudo mkdir -p /var/log/file-manager
```

### 3. **Clone and Setup Project**
```bash
# Navigate to your preferred location
cd /home/your-username  # or wherever you keep projects

# Clone your repository
git clone https://github.com/YOUR_USERNAME/file-manager.git
cd file-manager

# Install dependencies
npm install
cd server
npm install
cd ..
```

### 4. **Configure File Paths**
Edit the server configuration:
```bash
nano server/index.js
```

Update the `FILE_PATHS` object with your actual VPS paths:
```javascript
const FILE_PATHS = {
  'rbs-modump-sunset': '/home/your-username/dumps/rbs-modump-sunset',
  'rnc-modump-sunset': '/home/your-username/dumps/rnc-modump-sunset', 
  'migration-modump': '/home/your-username/dumps/migration-modump',
  'allip-bsc': '/home/your-username/dumps/allip-bsc'
};
```

### 5. **Build and Deploy**
```bash
# Build the frontend for production
npm run build

# Run the deployment script
./deploy.sh
```

### 6. **Configure nginx**
Edit your nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/default
```

Add this to your existing server block:
```nginx
# API proxy for file manager
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# File Manager frontend
location /files/ {
    alias /var/www/file-manager/;
    try_files $uri $uri/ /files/index.html;
    index index.html;
}

# Your existing Streamlit configuration stays the same
```

### 7. **Restart Services**
```bash
# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl reload nginx

# Check PM2 status
pm2 status
pm2 logs file-api
```

## 🌐 Access Your Application

Your File Manager will be available at:
- **File Manager**: `https://dump.wisbay.my.id/` (or `https://dump.wisbay.my.id/files/` if using subpath)
- **API Health**: `https://dump.wisbay.my.id/api/health`
- **Your Streamlit**: Wherever it's currently configured (unchanged)

## 🔄 Updates via GitHub

To update your application:
```bash
# On VPS
cd /path/to/file-manager
git pull origin main
npm run build
./deploy.sh
```

## 🔍 Troubleshooting

**Check API server:**
```bash
pm2 status
pm2 logs file-api
curl http://localhost:3001/api/health
```

**Check nginx:**
```bash
sudo nginx -t
sudo systemctl status nginx
tail -f /var/log/nginx/error.log
```

**Test from outside:**
```bash
curl https://dump.wisbay.my.id/api/health
```

**File permissions:**
```bash
sudo chown -R www-data:www-data /var/www/file-manager
sudo chmod -R 755 /var/www/file-manager
```

## 🔐 Security Considerations

1. **Firewall**: Ensure only port 80/443 are open to public
2. **File paths**: API validates paths are within allowed directories
3. **nginx**: Consider rate limiting for API endpoints
4. **SSL**: Your domain should already have SSL via Let's Encrypt

## 🎯 Final URLs Structure
```
dump.wisbay.my.id/              → File Manager React app (main)
dump.wisbay.my.id/api/          → File Manager API
dump.wisbay.my.id/streamlit/    → Your existing Streamlit app (if same domain)
```

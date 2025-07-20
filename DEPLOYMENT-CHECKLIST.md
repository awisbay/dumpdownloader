# 🚀 Quick Deployment Checklist for dump.wisbay.my.id

## Pre-deployment Checklist
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] VPS access confirmed
- [ ] Domain dump.wisbay.my.id points to your VPS

## Deployment Steps

### 1. Push to GitHub (Local)
```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/file-manager.git
git push -u origin main
```

### 2. VPS Setup
```bash
# SSH to your VPS
ssh user@dump.wisbay.my.id

# Install dependencies (if not done)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone project
git clone https://github.com/YOUR_USERNAME/file-manager.git
cd file-manager
```

### 3. Configure File Paths
```bash
# Edit server configuration
nano server/index.js
```
Update the `FILE_PATHS` object with your actual dump file locations on the VPS.

### 4. Build and Deploy
```bash
# Install and build
npm install
cd server && npm install && cd ..
npm run build

# Deploy
./deploy.sh
```

### 5. nginx Configuration
```bash
# Copy the nginx config
sudo cp nginx-dump.wisbay.my.id.conf /etc/nginx/sites-available/dump.wisbay.my.id

# Enable the site
sudo ln -s /etc/nginx/sites-available/dump.wisbay.my.id /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Setup (if not already done)
```bash
# Install certbot if needed
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d dump.wisbay.my.id
```

## Post-deployment Verification

### Test API
```bash
curl https://dump.wisbay.my.id/api/health
```

### Test Frontend
Open browser: `https://dump.wisbay.my.id`

### Check PM2
```bash
pm2 status
pm2 logs file-api
```

## URLs After Deployment
- **File Manager**: https://dump.wisbay.my.id
- **API**: https://dump.wisbay.my.id/api/health
- **Files**: Will list your actual VPS dump files

## Troubleshooting
- **502 Bad Gateway**: Check if PM2 API server is running (`pm2 status`)
- **404 Not Found**: Check nginx config and file permissions
- **CORS Issues**: API is configured to accept requests from your domain
- **File Access**: Ensure file paths in `server/index.js` are correct

## Quick Update Process
```bash
# On VPS
cd file-manager
git pull origin main
npm run build
./deploy.sh
```

🎯 **Your File Manager will be live at: https://dump.wisbay.my.id**

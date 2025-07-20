#!/bin/bash

echo "🚀 Deploying File Manager to VPS"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're on the VPS (adjust this check based on your setup)
if [ ! -d "/var/www" ]; then
    echo -e "${RED}❌ This script should be run on your VPS server${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}📁 Creating directories...${NC}"
sudo mkdir -p /var/www/file-manager
sudo mkdir -p /var/log/file-manager
mkdir -p pm2-logs

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

cd server
npm install
cd ..

# Build the frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
npm run build

# Copy built files to web directory
echo -e "${YELLOW}📋 Copying files to web directory...${NC}"
sudo cp -r dist/* /var/www/file-manager/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/file-manager
sudo chmod -R 755 /var/www/file-manager

# Start the API server with PM2
echo -e "${YELLOW}🔄 Starting API server with PM2...${NC}"
pm2 delete file-api 2>/dev/null || true
pm2 start ecosystem.config.json

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}📱 Frontend: Available at your domain${NC}"
echo -e "${GREEN}🔗 API: Running on port 3001${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your nginx configuration"
echo "2. Restart nginx: sudo systemctl reload nginx"
echo "3. Update file paths in server/index.js if needed"
echo "4. Check PM2 status: pm2 status"

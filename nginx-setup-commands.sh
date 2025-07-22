#!/bin/bash
# nginx Setup Commands for dump.wisbay.my.id
# Run these commands on your VPS after cloning the repository

echo "🔧 Setting up nginx configuration for dump.wisbay.my.id"
echo ""

# Check if SSL certificates exist
if [ -f "/etc/letsencrypt/live/dump.wisbay.my.id/fullchain.pem" ]; then
    echo "🔒 SSL certificates found! Using HTTPS configuration..."
    CONFIG_FILE="nginx-dump.wisbay.my.id.conf"
else
    echo "⚠️  No SSL certificates found. Using HTTP-only configuration..."
    echo "   You can add SSL later with: sudo certbot --nginx -d dump.wisbay.my.id"
    CONFIG_FILE="nginx-http-only.conf"
fi

# Step 1: Copy the appropriate nginx configuration file
echo "📋 Copying nginx configuration ($CONFIG_FILE)..."
sudo cp "$CONFIG_FILE" /etc/nginx/sites-available/dump.wisbay.my.id

# Step 2: Enable the site (create symbolic link)
echo "🔗 Enabling site..."
sudo ln -sf /etc/nginx/sites-available/dump.wisbay.my.id /etc/nginx/sites-enabled/

# Step 3: Test nginx configuration
echo "✅ Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx configuration is valid!"
    
    # Step 4: Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo "🎉 nginx configuration applied successfully!"
    echo ""
    echo "🌐 Your site should now be available at:"
    if [ "$CONFIG_FILE" = "nginx-http-only.conf" ]; then
        echo "   • http://dump.wisbay.my.id"
        echo ""
        echo "🔒 To add SSL later, run:"
        echo "   sudo apt install certbot python3-certbot-nginx"
        echo "   sudo certbot --nginx -d dump.wisbay.my.id"
        echo "   Then re-run this script to use HTTPS configuration"
    else
        echo "   • http://dump.wisbay.my.id (redirects to HTTPS)"
        echo "   • https://dump.wisbay.my.id"
    fi
    echo ""
    echo "📊 Check status:"
    echo "   sudo systemctl status nginx"
    echo "   sudo tail -f /var/log/nginx/dump.wisbay.my.id.error.log"
    echo "   curl -I http://dump.wisbay.my.id"
else
    echo "❌ nginx configuration has errors. Please check and fix before proceeding."
    exit 1
fi

# SSL Setup Guide for dump.wisbay.my.id

## Quick SSL Setup with Let's Encrypt

If you want to add SSL/HTTPS to your domain, follow these steps:

### 1. Install Certbot
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 2. Get SSL Certificate
```bash
sudo certbot --nginx -d dump.wisbay.my.id
```

This will:
- Automatically detect your nginx configuration
- Get SSL certificates from Let's Encrypt
- Update your nginx config to use HTTPS
- Set up automatic renewal

### 3. Switch to HTTPS Configuration
After getting SSL certificates, run:
```bash
./nginx-setup-commands.sh
```

The script will automatically detect the SSL certificates and use the HTTPS configuration.

### 4. Test SSL
```bash
# Test HTTPS
curl -I https://dump.wisbay.my.id

# Check SSL certificate
openssl s_client -connect dump.wisbay.my.id:443 -servername dump.wisbay.my.id
```

### 5. Verify Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

## Manual SSL Configuration

If you prefer to set up SSL manually or use other certificates:

1. Place your SSL certificates in:
   - Certificate: `/etc/ssl/certs/dump.wisbay.my.id.crt`
   - Private Key: `/etc/ssl/private/dump.wisbay.my.id.key`

2. Update the nginx configuration paths in `nginx-dump.wisbay.my.id.conf`

3. Run the nginx setup script

## Troubleshooting SSL

**Certificate validation failed:**
- Check if your domain points to the correct IP
- Verify port 80 is accessible from the internet
- Check firewall settings

**nginx SSL errors:**
- Verify certificate file paths exist
- Check certificate file permissions
- Test nginx config: `sudo nginx -t`

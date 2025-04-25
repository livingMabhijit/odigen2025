# Deployment Guide for OdiGen 2025 Website

## Prerequisites
- A purchased domain name
- Node.js and npm installed
- Git installed

## Hosting Options

### Option 1: DigitalOcean (Recommended)
1. Create a DigitalOcean account
2. Create a new Droplet:
   - Choose Ubuntu 22.04 LTS
   - Select Basic plan
   - Choose a datacenter region close to your target audience (e.g., Bangalore for Indian users)
   - Add SSH key for secure access

3. Connect to your Droplet:
```bash
ssh root@your-droplet-ip
```

4. Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

5. Install PM2 (Process Manager):
```bash
npm install -y pm2 -g
```

6. Clone your repository:
```bash
git clone <your-repo-url>
cd Hackathon2025
npm install
```

7. Create .env file:
```bash
touch .env
# Add your environment variables
```

8. Start the application with PM2:
```bash
pm2 start server.js --name hackathon
pm2 startup
pm2 save
```

9. Install and configure Nginx:
```bash
sudo apt install nginx
```

Create Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. Install SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Heroku
1. Create a Heroku account
2. Install Heroku CLI
3. Login to Heroku:
```bash
heroku login
```

4. Create a new Heroku app:
```bash
heroku create odigen-2025
```

5. Add environment variables:
```bash
heroku config:set NODE_ENV=production
```

6. Deploy:
```bash
git push heroku main
```

## Domain Configuration

1. Go to your domain registrar's dashboard
2. Update nameservers or DNS records:
   - For DigitalOcean: Point A record to your Droplet's IP
   - For Heroku: Add CNAME record pointing to your-app.herokuapp.com

## Environment Variables
Create a `.env` file with these variables:
```env
NODE_ENV=production
PORT=3000
ADMIN_KEY=your-secure-key
```

## Post-Deployment Checklist
- [ ] Verify SSL certificate is working (https://)
- [ ] Test all routes and functionality
- [ ] Check static assets (images, PDFs) are loading
- [ ] Verify form submissions
- [ ] Test mobile responsiveness
- [ ] Monitor server logs for any errors

## Maintenance
- Set up regular backups
- Monitor server health
- Keep dependencies updated
- Regularly check SSL certificate expiration

## Troubleshooting
- Check nginx error logs: `/var/log/nginx/error.log`
- Check application logs: `pm2 logs`
- Verify domain DNS propagation: `dig yourdomain.com`
- Test server status: `systemctl status nginx`

## Support
For any deployment issues, contact your hosting provider's support or refer to their documentation:
- [DigitalOcean Documentation](https://www.digitalocean.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com)

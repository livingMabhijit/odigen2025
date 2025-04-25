# Deploying to Render with Custom Domain

## Step 1: Prepare Your Application
1. Ensure your `package.json` has the correct start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

2. Make sure your server listens on the PORT environment variable:
```javascript
const port = process.env.PORT || 3000;
```

## Step 2: Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up for a new account
3. Verify your email address

## Step 3: Deploy Your Application
1. Click "New +" in the Render dashboard
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure your web service:
   - Name: `odigen-2025` (or your preferred name)
   - Environment: `Node`
   - Region: Choose closest to your users (e.g., Singapore for Asia)
   - Branch: `main` (or your deployment branch)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free (or paid if you need more resources)

5. Set environment variables:
   - Click "Environment" tab
   - Add the following:
     ```
     NODE_ENV=production
     ADMIN_KEY=your-secure-key
     ```

6. Click "Create Web Service"

## Step 4: Add Your Custom Domain
1. Purchase a domain from any registrar (e.g., GoDaddy, Namecheap)
2. In your Render dashboard:
   - Go to your web service
   - Click "Settings"
   - Scroll to "Custom Domains"
   - Click "Add Custom Domain"
   - Enter your domain (e.g., `odigen2025.com`)
   - Click "Add Domain"

3. Render will provide DNS records to add:
   - CNAME record
   - Verification TXT record

4. Go to your domain registrar's DNS settings:
   - Add the CNAME record:
     ```
     Type: CNAME
     Host: www
     Value: [your-app].onrender.com
     TTL: 3600 (or automatic)
     ```
   - Add the TXT record for verification:
     ```
     Type: TXT
     Host: _render-verification
     Value: [provided by Render]
     TTL: 3600 (or automatic)
     ```
   - For root domain (optional), add an A record:
     ```
     Type: A
     Host: @
     Value: 76.76.21.21
     TTL: 3600
     ```

5. Wait for DNS propagation (can take up to 48 hours)

## Step 5: SSL Configuration
Render automatically provides free SSL certificates through Let's Encrypt:
1. No manual configuration needed
2. SSL is automatically renewed
3. Forces HTTPS by default

## Step 6: Verify Deployment
1. Visit your custom domain (e.g., `https://odigen2025.com`)
2. Check that:
   - HTTPS is working (green lock in browser)
   - All pages load correctly
   - Images and assets are loading
   - Forms are working
   - No console errors

## Troubleshooting
1. If domain isn't working:
   - Check DNS propagation: use [whatsmydns.net](https://www.whatsmydns.net/)
   - Verify DNS records are correct
   - Wait for DNS propagation (up to 48 hours)

2. If assets aren't loading:
   - Check your paths are correct
   - Verify static file serving in server.js
   - Check Render logs for errors

3. If deployment fails:
   - Check Render logs
   - Verify package.json scripts
   - Check environment variables

## Monitoring
1. Render provides basic monitoring:
   - View logs in real-time
   - Monitor resource usage
   - Set up alerts for outages

2. Additional monitoring (optional):
   - Set up Uptime Robot for uptime monitoring
   - Use Google Analytics for traffic monitoring
   - Implement error tracking with Sentry

## Cost Considerations
1. Render Free Tier includes:
   - 750 hours/month of runtime
   - Automatic HTTPS
   - Global CDN
   - DDoS protection
   - Build minutes

2. Paid Tiers offer:
   - More resources
   - Better performance
   - Zero cold starts
   - Custom domains on all services

## Best Practices
1. Always test locally before deploying
2. Use environment variables for configuration
3. Keep dependencies updated
4. Monitor application logs
5. Set up automatic deployments
6. Implement proper error handling
7. Use compression for better performance
8. Enable caching where appropriate

## Support
- Render Documentation: [docs.render.com](https://docs.render.com)
- Render Status: [status.render.com](https://status.render.com)
- Render Support: [render.com/support](https://render.com/support)

# 🚀 Netlify Deployment Guide

## Quick Setup for Flex    Well

### 1. Push to GitHub
- Commit all changes
- Push to your GitHub repository

### 2. Connect to Netlify
- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Choose your repository

### 3. Build Settings
- **Build command**: `npm run functions:install && npm run build`
- **Publish directory**: `build`
- **Functions directory**: `netlify/functions`

### 4. Environment Variables
Go to Site Settings → Environment Variables → Add a single variable

**Add these 2 variables:**

**Variable 1:**
- Key: `MONGODB_URI`
- Value: Your MongoDB Atlas connection string
- Scopes: ✅ Builds, ✅ Functions, ✅ Runtime
- Secret: ✅ Yes

**Variable 2:**
- Key: `JWT_SECRET`
- Value: Any secure random string for JWT authentication
- Scopes: ✅ Builds, ✅ Functions, ✅ Runtime
- Secret: ✅ Yes

### 5. MongoDB Atlas Setup
- Go to MongoDB Atlas → Network Access
- Add IP Address: `0.0.0.0/0` (Allow access from anywhere)

### 6. Deploy
- Click "Deploy site"
- Wait for build to complete
- Test your site!

## Testing Your Deployment

### Test Functions:
- Health: `https://your-site.netlify.app/.netlify/functions/health`
- Test Connection: `https://your-site.netlify.app/.netlify/functions/test-connection`

### Admin Login:
- URL: `https://your-site.netlify.app/admin`
- Username: `admin`
- Password: `flexwell2024`

## Troubleshooting

If you see errors:
1. Check function logs in Netlify dashboard
2. Verify environment variables are set
3. Check MongoDB Atlas IP whitelist
4. Test individual functions

---
✅ Your Flex    Well website with full database functionality is now live! 
# 🚨 Netlify Troubleshooting Guide

## Black Screen on Admin Page

### 1. Check Function Logs
- Netlify Dashboard → Your Site → Functions tab
- Look for errors in function execution

### 2. Check Deploy Logs  
- Netlify Dashboard → Your Site → Deploys tab
- Click latest deploy → View build logs
- Look for function installation errors

### 3. Check Browser Console
- Open admin page → F12 → Console tab
- Look for JavaScript errors

### 4. Common Issues & Fixes

#### A. Functions Failed to Install
**Symptoms:** Build logs show npm install errors
**Fix:** 
```bash
# Locally test the build
npm run functions:install
npm run build
```

#### B. Environment Variables Missing
**Symptoms:** "MongoDB connection error" in function logs
**Fix:** 
- Go to Site Settings → Environment Variables
- Ensure both `MONGODB_URI` and `JWT_SECRET` are set

#### C. Function Timeout
**Symptoms:** Functions take too long to respond
**Fix:** MongoDB connection optimization (already done)

#### D. CORS Errors
**Symptoms:** "Access-Control-Allow-Origin" errors in browser console
**Fix:** Functions already include CORS headers

### 5. Test Functions Individually

Visit these URLs to test each function:
- `https://your-site.netlify.app/.netlify/functions/health`
- `https://your-site.netlify.app/.netlify/functions/auth-login`

### 6. Emergency Fallback

If functions aren't working, the admin panel should fall back to localStorage mode. 

### 7. Quick Deploy Fix

Try rebuilding:
1. Go to Deploys tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for build to complete

### 8. Contact Points

If still broken:
1. Check function logs for specific errors
2. Verify environment variables are exactly correct
3. Test MongoDB connection from MongoDB Atlas dashboard 
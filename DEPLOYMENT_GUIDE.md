# 🚀 Flex    Well Deployment Guide

This guide will help you deploy your Flex    Well website with database functionality securely to production.

## 📋 Overview

- **Frontend**: Deploy to Netlify (static hosting)
- **Backend**: Deploy to Railway (Node.js + Express API)
- **Database**: MongoDB Atlas (already set up)

## 🗄️ Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### 1.2 Deploy Your Backend
1. Push your code to GitHub
2. In Railway dashboard, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your flexwell repository
5. Railway will auto-detect it's a Node.js project

### 1.3 Set Environment Variables in Railway
Go to your Railway project → Variables tab and add these:

```
MONGODB_URI=mongodb+srv://flexwell-admin:Aasi2ON4lr4MkpqD@flexwell-cluster.turqknf.mongodb.net/?retryWrites=true&w=majority&appName=flexwell-cluster
JWT_SECRET=flex-well-super-secure-jwt-secret-key-production-2024
NODE_ENV=production
PORT=5001
ADMIN_USERNAME=admin
ADMIN_PASSWORD=flexwell2024
FRONTEND_URL=https://your-netlify-site.netlify.app
```

**⚠️ IMPORTANT**: Replace `your-netlify-site.netlify.app` with your actual Netlify URL

### 1.4 Get Your Railway Backend URL
After deployment, Railway will give you a URL like: `https://your-app-name.railway.app`

## 🌐 Step 2: Update Frontend for Production

### 2.1 Update Environment Variables
Create a `.env` file in your project root:

```
REACT_APP_API_URL=https://your-app-name.railway.app/api
```

Replace `your-app-name.railway.app` with your actual Railway URL.

### 2.2 Build for Production
```bash
npm run build
```

## 🚀 Step 3: Deploy Frontend to Netlify

### 3.1 Build and Deploy
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Environment variables**: Add `REACT_APP_API_URL=https://your-railway-url.railway.app/api`

### 3.2 Update Railway CORS Settings
After getting your Netlify URL, update the `FRONTEND_URL` in Railway variables:
```
FRONTEND_URL=https://your-actual-netlify-site.netlify.app
```

## 🔒 Step 4: Security Configuration

### 4.1 Update MongoDB IP Whitelist
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add `0.0.0.0/0` (allow from anywhere) or Railway's IP ranges
4. Click "Confirm"

### 4.2 Secure Your Environment Variables
- Never commit `.env` files to git
- Use strong, unique passwords
- Change the JWT_SECRET to a random 64-character string

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend
Visit your Railway URL + `/api/health`:
```
https://your-app-name.railway.app/api/health
```

Should return:
```json
{
  "message": "Flex    Well API is running!",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### 5.2 Test Frontend
1. Visit your Netlify URL
2. Test appointment booking
3. Test admin login (admin / flexwell2024)
4. Verify database operations work

## 🛠️ Step 6: Domain Setup (Optional)

### 6.1 Custom Domain for Frontend
1. In Netlify: Site settings → Domain management
2. Add your custom domain
3. Set up DNS records as instructed

### 6.2 Custom Domain for Backend
1. In Railway: Settings → Domains
2. Add your custom API domain
3. Update `REACT_APP_API_URL` in Netlify

## 🔧 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Railway matches your Netlify URL exactly
- Check both URLs use HTTPS

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes Railway IPs
- Check `MONGODB_URI` environment variable

### Admin Login Not Working
- Check JWT_SECRET is set in Railway
- Verify admin credentials in environment variables

### 404 Errors on Netlify
- Ensure `_redirects` file is in `public/` folder
- Check `netlify.toml` configuration

## 📱 Admin Panel Access

**Production Login:**
- URL: `https://your-netlify-site.netlify.app/admin`
- Username: `admin`
- Password: `flexwell2024`

## 🚀 Going Live Checklist

- [ ] Backend deployed to Railway
- [ ] Environment variables set in Railway
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Frontend built and deployed to Netlify
- [ ] CORS configured correctly
- [ ] Admin panel login tested
- [ ] Appointment booking tested
- [ ] SSL certificates active (automatic)

## 🆘 Need Help?

If you encounter issues:
1. Check Railway logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test each component individually

---

🎉 **Congratulations!** Your Flex    Well website is now live with full database functionality! 
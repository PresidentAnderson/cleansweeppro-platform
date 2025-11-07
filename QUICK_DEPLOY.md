# Quick Deployment Guide

## ✅ Step 1: GitHub (COMPLETED)
Your code is live at: https://github.com/PresidentAnderson/cleansweeppro-platform

## 🚀 Step 2: Deploy Frontend to Vercel

### Method 1: Vercel Dashboard (Recommended - 5 minutes)

1. **Go to Vercel**
   - Visit: https://vercel.com/new

2. **Import Repository**
   - Click "Import Git Repository"
   - Search for: `cleansweeppro-platform`
   - Click "Import"

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variable**
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.com/api/v1
   ```
   (You can use a placeholder for now and update it later)

5. **Click Deploy**
   - Wait 2-3 minutes
   - You'll get a URL like: `https://cleansweeppro-platform.vercel.app`

### Method 2: Vercel CLI (Alternative)

If you get permission errors with CLI, use the dashboard method above instead.

```bash
cd frontend
vercel --prod
```

## 📋 Next Steps After Frontend Deployment

### 1. Deploy Backend (Choose One Platform)

**Option A: Railway** (Easiest)
- Visit: https://railway.app
- Click "New Project" → "Deploy from GitHub repo"
- Select: `cleansweeppro-platform`
- Add PostgreSQL database
- Add environment variables (see DEPLOYMENT.md)

**Option B: Render**
- Visit: https://render.com
- Create Web Service from GitHub
- Add PostgreSQL database
- Configure build/start commands (see DEPLOYMENT.md)

**Option C: Heroku**
- Use Heroku CLI (see DEPLOYMENT.md)

### 2. Update Environment Variables

Once backend is deployed:
1. Get your backend URL (e.g., `https://cleansweeppro.railway.app`)
2. Go to Vercel project settings
3. Update `VITE_API_URL` to your actual backend URL
4. Redeploy frontend

### 3. Update CORS Settings

In `backend/app/main.py`, add your Vercel URL to allowed origins:
```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cleansweeppro-platform.vercel.app",  # Your Vercel URL
    "https://*.vercel.app"
],
```

### 4. Run Database Migrations

After backend deployment:
```bash
# Connect to your backend platform and run:
alembic upgrade head
```

## 🎉 You're Done!

Your application will be live at:
- **Frontend**: https://cleansweeppro-platform.vercel.app (or your custom domain)
- **Backend**: https://your-backend-url.com
- **GitHub**: https://github.com/PresidentAnderson/cleansweeppro-platform

## 📚 Need More Help?

- See `DEPLOYMENT.md` for detailed deployment guides
- See `README.md` for project documentation
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app

## 🔧 Troubleshooting

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

**Can't connect to backend:**
- Check CORS settings in backend
- Verify VITE_API_URL is correct
- Check backend is running

**Database errors:**
- Ensure migrations are run
- Check DATABASE_URL is set correctly
- Verify PostgreSQL is accessible

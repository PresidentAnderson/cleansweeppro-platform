# Deployment Guide

## Frontend Deployment to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm install -g vercel`

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (already done ✓)

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository: `cleansweeppro-platform`
   - Configure the project:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables**
   - In the Vercel dashboard, go to Project Settings > Environment Variables
   - Add the following variable:
     ```
     VITE_API_URL=https://your-backend-url.com/api/v1
     ```
   - Note: You'll need to deploy the backend first or use a temporary backend URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - You'll get a URL like: `https://cleansweeppro-platform.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your account
   - Link to existing project or create new one
   - Set root directory to current directory
   - Accept default build settings

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   ```
   - Enter your backend API URL when prompted

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Post-Deployment Configuration

1. **Update CORS Settings**
   - Update `backend/app/main.py` to allow your Vercel domain:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:3000",
           "http://localhost:5173",
           "https://cleansweeppro-platform.vercel.app",  # Add your Vercel URL
           "https://*.vercel.app"  # Or use wildcard for preview deployments
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Update Environment Variables**
   - Once you have your backend deployed, update the `VITE_API_URL` in Vercel
   - Go to Project Settings > Environment Variables
   - Update the value to your actual backend URL
   - Redeploy the project

## Backend Deployment Options

### Option 1: Railway

1. **Sign up at https://railway.app**

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `cleansweeppro-platform`
   - Select the backend directory

3. **Add Environment Variables**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   SECRET_KEY=your-production-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Add PostgreSQL Database**
   - In Railway, click "New" > "Database" > "PostgreSQL"
   - Railway will automatically set DATABASE_URL

5. **Deploy**
   - Railway will automatically deploy
   - You'll get a URL like: `https://cleansweeppro-production.railway.app`

### Option 2: Render

1. **Sign up at https://render.com**

2. **Create Web Service**
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: cleansweeppro-backend
     - **Root Directory**: backend
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL Database**
   - Click "New" > "PostgreSQL"
   - Connect it to your web service

4. **Add Environment Variables**
   - Same as Railway above

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku  # macOS
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create cleansweeppro-backend
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set ALGORITHM=HS256
   heroku config:set ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Create Procfile**
   ```bash
   echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Sign up at https://digitalocean.com**

2. **Create App**
   - Go to Apps > Create App
   - Select GitHub repository
   - Configure backend component:
     - **Source Directory**: backend
     - **Type**: Web Service
     - **Build Command**: `pip install -r requirements.txt`
     - **Run Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8080`

3. **Add Database**
   - Add PostgreSQL database component
   - Link to web service

4. **Deploy**

## Database Migrations

After deploying the backend, run migrations:

**Railway/Render:**
```bash
# Connect to the container
railway run bash  # or render ssh

# Run migrations
alembic upgrade head
```

**Heroku:**
```bash
heroku run alembic upgrade head
```

## Production Checklist

- [ ] Change SECRET_KEY to a strong random value
- [ ] Update CORS origins to include production domains
- [ ] Set up environment variables on all platforms
- [ ] Run database migrations
- [ ] Test authentication flow
- [ ] Test all CRUD operations
- [ ] Set up monitoring and logging
- [ ] Configure domain names (optional)
- [ ] Set up SSL certificates (usually automatic)
- [ ] Configure rate limiting
- [ ] Set up backups for database
- [ ] Review security settings

## Continuous Deployment

Both Vercel and backend platforms support automatic deployments:

- **Vercel**: Automatically deploys on push to main branch
- **Railway/Render/Heroku**: Can be configured for auto-deploy on GitHub push

To set up:
1. Go to project settings
2. Enable "Auto Deploy" from main branch
3. Every push to main will trigger a new deployment

## Custom Domains

### Vercel (Frontend)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Backend Platforms
- Follow similar steps in your backend hosting platform
- Update environment variables in Vercel to use custom backend domain

## Monitoring and Logs

### Vercel
- View logs in the Vercel dashboard under "Deployments"
- Set up integrations with monitoring tools

### Backend
- Use platform-specific logging
- Consider integrating with services like:
  - Sentry for error tracking
  - LogDNA/Logtail for log management
  - New Relic/Datadog for APM

## Troubleshooting

### Frontend Build Fails
- Check that all dependencies are in package.json
- Verify Node version compatibility
- Check build logs for specific errors

### Backend Deployment Fails
- Verify all environment variables are set
- Check database connection string
- Review application logs

### CORS Errors
- Ensure frontend URL is in CORS allow_origins
- Check that credentials are properly configured

### Database Connection Issues
- Verify DATABASE_URL format
- Check if database is accessible from backend
- Ensure migrations have been run

## Support

For deployment issues:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Heroku: https://devcenter.heroku.com

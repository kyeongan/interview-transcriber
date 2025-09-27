# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Option 1: Frontend Only (Recommended)

Deploy just the frontend to Vercel and use Railway for the backend.

### Option 2: Full Stack on Vercel

Deploy both frontend and backend to Vercel (with limitations).

## Frontend Deployment

### Step 1: Deploy Frontend

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import `kyeongan/interview-transcriber` from GitHub
4. Configure project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-railway-url.railway.app
```

## Backend Deployment (Alternative Options)

### Option A: Use Railway for Backend (Recommended)

1. Deploy backend to Railway (persistent file storage)
2. Frontend on Vercel connects to Railway backend
3. Best performance for file uploads

### Option B: Backend on Vercel (Limitations)

⚠️ **Note**: Vercel serverless functions have limitations:

- No persistent file storage
- 50MB request limit
- Files stored temporarily

If using Vercel for backend:

1. Create new Vercel project
2. **Root Directory**: `server`
3. **Environment Variables**:

```
DEEPGRAM_API_KEY=your_deepgram_key
NODE_ENV=production
```

## Deployment Commands

```bash
# Commit all changes
git add .
git commit -m "feat: Add Vercel deployment configuration"
git push origin main
```

## Post-Deployment

1. **Update CORS**: Backend will automatically allow Vercel domains
2. **Test Upload**: Verify functionality in production
3. **Custom Domain**: Add custom domain in Vercel settings (optional)

## URLs

- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.vercel.app` or Railway URL

## Troubleshooting

- Check Vercel function logs for errors
- Verify environment variables are set
- For file upload issues, consider using Railway for backend

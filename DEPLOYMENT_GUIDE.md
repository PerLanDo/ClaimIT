# 🚀 Deployment Guide

## Prerequisites
- ✅ Dependencies installed (`npm install` completed)
- ✅ Environment files created (`.env` and `mobile/.env`)
- ✅ Vercel CLI installed (`npm install -g vercel`)

## Step 1: Configure Your Services

### 1.1 Update Environment Files
You need to edit both `.env` and `mobile/.env` files with your actual service credentials:

**Backend (.env):**
```bash
# Replace these with your actual values:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
B2_KEY_ID=your_actual_b2_key_id
B2_APPLICATION_KEY=your_actual_b2_application_key
VERCEL_TOKEN=your_actual_vercel_token
```

**Mobile (mobile/.env):**
```bash
# Replace these with your actual values:
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
EXPO_PUBLIC_B2_KEY_ID=your_actual_b2_key_id
EXPO_PUBLIC_B2_APPLICATION_KEY=your_actual_b2_application_key
```

### 1.2 Follow Service Setup Instructions
See `SERVICE_SETUP_INSTRUCTIONS.md` for detailed steps to:
- Set up Supabase project and database
- Create Backblaze B2 bucket and keys
- Get Vercel token

## Step 2: Test Locally

### 2.1 Test Backend
```bash
npm run dev
```

Then visit: `http://localhost:3000/api/health`

You should see a JSON response with service status.

### 2.2 Test Mobile App
```bash
cd mobile
npm start
```

## Step 3: Deploy to Vercel

### 3.1 Login to Vercel
```bash
vercel login
```

### 3.2 Deploy Backend
```bash
vercel --prod
```

This will:
1. Create a new Vercel project
2. Deploy your backend
3. Give you a production URL (like `https://your-project.vercel.app`)

### 3.3 Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add all variables from your `.env` file:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `B2_KEY_ID`
   - `B2_APPLICATION_KEY`
   - `B2_BUCKET_NAME`
   - `B2_ENDPOINT`
   - `VERCEL_TOKEN`
   - `VERCEL_TEAM_ID`
   - `JWT_SECRET`
   - `NODE_ENV=production`

4. Set them for **Production**, **Preview**, and **Development**

### 3.4 Update Mobile App Configuration
After deployment, update your `mobile/.env` file:
```bash
EXPO_PUBLIC_API_URL=https://your-project.vercel.app/api
```

## Step 4: Verify Deployment

### 4.1 Test Production Health Endpoint
Visit: `https://your-project.vercel.app/api/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "supabase": { "status": "healthy" },
    "vercel": { "status": "healthy" },
    "backblaze": { "status": "healthy" }
  }
}
```

### 4.2 Test MCP Endpoints
- `https://your-project.vercel.app/api/mcp/status`
- `https://your-project.vercel.app/api/mcp/health`

## Step 5: Mobile App Deployment

### 5.1 Build for Production
```bash
cd mobile
eas build --platform android
eas build --platform ios
```

### 5.2 Submit to App Stores
```bash
eas submit --platform android
eas submit --platform ios
```

## 🔧 Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**
   - Make sure all variables are set in Vercel dashboard
   - Check variable names match exactly
   - Ensure no extra spaces or quotes

2. **Supabase Connection Failed**
   - Verify your Supabase URL and keys
   - Check if database tables exist
   - Ensure RLS policies are configured

3. **Backblaze Upload Failed**
   - Verify B2 credentials and bucket name
   - Check bucket permissions
   - Ensure endpoint URL is correct

4. **Vercel Deployment Failed**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify server.js is the entry point

### Debug Commands:
```bash
# Check local server
npm run dev

# Check Vercel deployment
vercel logs

# Check environment variables
vercel env ls
```

## 📱 Next Steps

1. ✅ Configure all services
2. ✅ Test locally
3. ✅ Deploy to Vercel
4. ✅ Set environment variables
5. ✅ Test production endpoints
6. 🎉 Your ClaimIT backend is live!

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Backblaze B2 Console**: https://secure.backblaze.com/user_signin.htm
- **Health Check**: `https://your-project.vercel.app/api/health`

## 📞 Support

If you encounter issues:
1. Check the service setup instructions
2. Verify all environment variables are set
3. Check the health endpoints for service status
4. Review Vercel deployment logs

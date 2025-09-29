# Service Setup Instructions

## 🚀 Quick Setup Guide

### 1. Supabase Setup (Database & Authentication)

#### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/login
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `claimit-database`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

#### Step 2: Get Your Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

#### Step 3: Create Database Tables
1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL script:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  student_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location_found VARCHAR(255),
  date_found TIMESTAMP WITH TIME ZONE,
  image_urls TEXT[],
  status VARCHAR(50) DEFAULT 'found',
  finder_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table
CREATE TABLE claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id),
  claimant_id UUID REFERENCES users(id),
  claim_description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - you can customize these)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can view items" ON items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert items" ON items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own items" ON items FOR UPDATE USING (auth.uid()::text = finder_id::text);

CREATE POLICY "Users can view their own claims" ON claims FOR SELECT USING (auth.uid()::text = claimant_id::text);
CREATE POLICY "Authenticated users can create claims" ON claims FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view messages for their claims" ON messages FOR SELECT USING (
  claim_id IN (
    SELECT id FROM claims WHERE claimant_id::text = auth.uid()::text
  )
);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

#### Step 4: Update Environment Files
Edit your `.env` and `mobile/.env` files with your Supabase credentials:

```bash
# In .env (backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# In mobile/.env (mobile app)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

### 2. Backblaze B2 Setup (File Storage)

#### Step 1: Create Backblaze Account
1. Go to [https://www.backblaze.com/b2/cloud-storage.html](https://www.backblaze.com/b2/cloud-storage.html)
2. Click "Sign Up" and create your account
3. Verify your email address

#### Step 2: Create B2 Bucket
1. Login to your Backblaze account
2. Go to **B2 Cloud Storage** → **Buckets**
3. Click **Create a Bucket**
4. Enter bucket details:
   - **Bucket Name**: `claimit-images`
   - **Files in Bucket**: Private
   - **Default Encryption**: Server-Side Encryption
5. Click **Create a Bucket**

#### Step 3: Create Application Key
1. Go to **App Keys** in the left sidebar
2. Click **Add a New Application Key**
3. Enter key details:
   - **Key Name**: `claimit-app-key`
   - **Allow access to Bucket(s)**: Select `claimit-images`
   - **Type of Access**: Read and Write
4. Click **Create New Key**
5. **IMPORTANT**: Copy and save the **Key ID** and **Application Key** (you won't see them again!)

#### Step 4: Get Your Endpoint
Your endpoint will be: `https://s3.us-west-004.backblazeb2.com` (or similar based on your region)

#### Step 5: Update Environment Files
```bash
# In .env (backend)
B2_KEY_ID=your_key_id_here
B2_APPLICATION_KEY=your_application_key_here
B2_BUCKET_NAME=claimit-images
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com

# In mobile/.env (mobile app)
EXPO_PUBLIC_B2_KEY_ID=your_key_id_here
EXPO_PUBLIC_B2_APPLICATION_KEY=your_application_key_here
EXPO_PUBLIC_B2_BUCKET_NAME=claimit-images
EXPO_PUBLIC_B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

---

### 3. Vercel Setup (Deployment)

#### Step 1: Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up" and create your account
3. Connect your GitHub account (recommended)

#### Step 2: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 3: Login to Vercel
```bash
vercel login
```

#### Step 4: Get Your Vercel Token
1. Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Enter token name: `claimit-backend`
4. Set expiration (recommend 1 year)
5. Click **Create Token**
6. Copy the token (you won't see it again!)

#### Step 5: Get Team ID (Optional)
1. Go to your Vercel dashboard
2. If you're in a team, the Team ID is in the URL or settings
3. If personal account, you can leave this empty

#### Step 6: Update Environment Files
```bash
# In .env (backend)
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_team_id_here (optional)
VERCEL_PROJECT_ID= (will be set after first deployment)
```

---

## 🧪 Testing Your Setup

### Test Backend
```bash
npm run dev
```

Visit: `http://localhost:3000/api/health`

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

### Test Mobile App
```bash
cd mobile
npm start
```

---

## 🚀 Deploy to Vercel

### Deploy Backend
```bash
vercel --prod
```

This will:
1. Create a new Vercel project
2. Deploy your backend
3. Give you a production URL
4. Set up automatic deployments from your Git repository

### Update Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add all your environment variables from `.env`
4. Make sure to set them for **Production**, **Preview**, and **Development**

---

## 🔧 Troubleshooting

### Common Issues:

1. **Supabase Connection Failed**
   - Check your URL and keys are correct
   - Ensure your database tables exist
   - Verify RLS policies are set up

2. **Backblaze Upload Failed**
   - Verify your credentials are correct
   - Check bucket name and permissions
   - Ensure endpoint URL is correct

3. **Vercel Deployment Failed**
   - Check your Vercel token is valid
   - Ensure all environment variables are set in Vercel dashboard
   - Check build logs in Vercel dashboard

4. **Mobile App Can't Connect**
   - Verify `EXPO_PUBLIC_` prefixed variables are set
   - Check if backend is running and accessible
   - Ensure CORS is configured properly

### Health Check Endpoints:
- `GET /api/health` - Overall system health
- `GET /api/mcp/status` - MCP services configuration
- `GET /api/mcp/health` - Detailed MCP services health

---

## 📱 Next Steps

1. ✅ Set up all three services
2. ✅ Update environment files
3. ✅ Test locally
4. ✅ Deploy to Vercel
5. 🎉 Start building your ClaimIT app!

For more detailed information, see the `MCP_SETUP_GUIDE.md` file.

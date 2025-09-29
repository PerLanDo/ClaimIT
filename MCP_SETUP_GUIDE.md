# MCP Integrations Setup Guide

This guide will help you set up MCP (Model Context Protocol) integrations for Supabase, Vercel, and Backblaze in your ClaimIT mobile app project.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Vercel account
- Backblaze B2 account

## 1. Supabase Setup

### 1.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the API settings
3. Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  student_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id),
  claimant_id UUID REFERENCES users(id),
  claim_description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 Configure Row Level Security (RLS)
Enable RLS on all tables and create appropriate policies for your app's security requirements.

## 2. Backblaze B2 Setup

### 2.1 Create B2 Bucket
1. Go to [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
2. Create a new bucket named `claimit-images`
3. Generate an Application Key with read/write permissions
4. Note down your Key ID and Application Key

### 2.2 Configure CORS (if needed)
If you plan to upload files directly from the mobile app, configure CORS settings for your bucket.

## 3. Vercel Setup

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Deploy Backend
```bash
vercel --prod
```

## 4. Environment Configuration

### 4.1 Backend Environment (.env)
Copy `env.example` to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Update the following variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `B2_KEY_ID`: Your Backblaze B2 Key ID
- `B2_APPLICATION_KEY`: Your Backblaze B2 Application Key
- `B2_BUCKET_NAME`: Your B2 bucket name (claimit-images)
- `B2_ENDPOINT`: Your B2 endpoint URL
- `VERCEL_TOKEN`: Your Vercel token (for MCP integration)
- `VERCEL_TEAM_ID`: Your Vercel team ID (optional)
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### 4.2 Mobile App Environment
Copy `mobile/env.example` to `mobile/.env`:

```bash
cp mobile/env.example mobile/.env
```

Update the following variables:
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `EXPO_PUBLIC_B2_KEY_ID`: Your Backblaze B2 Key ID
- `EXPO_PUBLIC_B2_APPLICATION_KEY`: Your Backblaze B2 Application Key
- `EXPO_PUBLIC_B2_BUCKET_NAME`: Your B2 bucket name
- `EXPO_PUBLIC_B2_ENDPOINT`: Your B2 endpoint URL
- `EXPO_PUBLIC_API_URL`: Your backend API URL

## 5. Installation and Setup

### 5.1 Install Backend Dependencies
```bash
npm install
```

### 5.2 Install Mobile App Dependencies
```bash
cd mobile
npm install
```

### 5.3 Start Development Servers

Backend:
```bash
npm run dev
```

Mobile App:
```bash
cd mobile
npm start
```

## 6. MCP Integration Usage

### 6.1 Backend Usage
The MCP services are automatically initialized when the server starts. You can access them through the MCPManager:

```javascript
const MCPManager = require('./services/mcp-manager');
const mcpManager = new MCPManager();

// Access Supabase
const supabase = mcpManager.getSupabase();
const result = await supabase.query('users', { limit: 10 });

// Access Backblaze
const backblaze = mcpManager.getBackblaze();
const uploadResult = await backblaze.uploadFile('test.jpg', fileBuffer);

// Access Vercel
const vercel = mcpManager.getVercel();
const projects = await vercel.listProjects();
```

### 6.2 Mobile App Usage
Import and use the MCP service in your React Native components:

```typescript
import { mcpService } from './services/mcp';

// Sign in user
const signInResult = await mcpService.signIn(email, password);

// Upload image
const uploadResult = await mcpService.uploadImage('item-123.jpg', imageBlob);

// Query data
const items = await mcpService.query('items', { 
  filters: [{ column: 'status', value: 'found' }] 
});
```

## 7. Health Check Endpoints

The backend provides several health check endpoints:

- `GET /api/health` - Overall system health including MCP services
- `GET /api/mcp/status` - MCP services configuration status
- `GET /api/mcp/health` - Detailed MCP services health check

## 8. Troubleshooting

### Common Issues:

1. **Supabase Connection Issues**
   - Verify your URL and keys are correct
   - Check if RLS policies are properly configured
   - Ensure your database tables exist

2. **Backblaze B2 Issues**
   - Verify your credentials and bucket name
   - Check CORS settings if uploading from browser
   - Ensure your bucket has proper permissions

3. **Vercel Deployment Issues**
   - Verify your Vercel token is valid
   - Check environment variables are set in Vercel dashboard
   - Ensure your project builds successfully locally

4. **Mobile App Issues**
   - Verify environment variables are prefixed with `EXPO_PUBLIC_`
   - Check if the backend API is accessible from your device
   - Ensure all dependencies are installed

## 9. Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Keys**: Use service role keys only on the backend, never expose them to the client
3. **RLS Policies**: Implement proper Row Level Security policies in Supabase
4. **CORS**: Configure CORS settings appropriately for your domains
5. **Rate Limiting**: The backend includes rate limiting to prevent abuse

## 10. Next Steps

1. Set up your database schema in Supabase
2. Configure your environment variables
3. Test the MCP integrations using the health check endpoints
4. Implement your app's specific business logic using the MCP services
5. Deploy to Vercel and test in production

For more detailed information about each service, refer to their respective documentation:
- [Supabase Documentation](https://supabase.com/docs)
- [Backblaze B2 Documentation](https://www.backblaze.com/b2/docs/)
- [Vercel Documentation](https://vercel.com/docs)

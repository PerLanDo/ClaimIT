-- ClaimIT Database Schema
-- Run this script in your Supabase SQL Editor to create the required tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  student_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
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

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id),
  claimant_id UUID REFERENCES users(id),
  claim_description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you may want to modify these based on your security requirements)

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Anyone can view items, but only the finder can update their items
CREATE POLICY "Anyone can view items" ON items FOR SELECT USING (true);
CREATE POLICY "Users can create items" ON items FOR INSERT WITH CHECK (auth.uid() = finder_id);
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (auth.uid() = finder_id);

-- Users can view claims related to their items or their own claims
CREATE POLICY "Users can view relevant claims" ON claims 
  FOR SELECT USING (
    auth.uid() = claimant_id OR 
    auth.uid() IN (SELECT finder_id FROM items WHERE id = item_id)
  );

-- Users can create claims
CREATE POLICY "Users can create claims" ON claims FOR INSERT WITH CHECK (auth.uid() = claimant_id);

-- Users can view messages for claims they're involved in
CREATE POLICY "Users can view relevant messages" ON messages 
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() IN (
      SELECT claimant_id FROM claims WHERE id = claim_id
      UNION
      SELECT finder_id FROM items WHERE id = (SELECT item_id FROM claims WHERE id = claim_id)
    )
  );

-- Users can send messages for claims they're involved in
CREATE POLICY "Users can send relevant messages" ON messages 
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND (
      auth.uid() IN (
        SELECT claimant_id FROM claims WHERE id = claim_id
        UNION
        SELECT finder_id FROM items WHERE id = (SELECT item_id FROM claims WHERE id = claim_id)
      )
    )
  );
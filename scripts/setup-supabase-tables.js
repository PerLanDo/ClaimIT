const MCPManager = require("../services/mcp-manager");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupSupabaseTables() {
  console.log("🚀 Setting up ClaimIT Supabase tables via MCP...");

  try {
    // Initialize MCP Manager
    const mcpManager = new MCPManager();

    // Get Supabase service
    const supabaseService = mcpManager.getSupabase();

    if (!supabaseService) {
      throw new Error("Supabase MCP service not available");
    }

    // Database schema SQL
    const setupSQL = `
-- ClaimIT Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff', 'teacher', 'admin')),
    school_id VARCHAR(50),
    mobile_number VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Items Table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    location VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'archived')),
    type VARCHAR(10) NOT NULL CHECK (type IN ('lost', 'found')),
    date_lost_found DATE NOT NULL,
    images TEXT[], -- Array of image URLs
    qr_code TEXT,
    reporter_id UUID NOT NULL REFERENCES users(id),
    claimed_by UUID REFERENCES users(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Claims Table
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    proof_images TEXT[], -- Array of proof image URLs
    description TEXT,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_id UUID, -- Can reference items, claims, etc.
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_reporter_id ON items(reporter_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_claims_item_id ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant_id ON claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Phones, laptops, tablets, etc.', 'devices'),
('Clothing', 'Shirts, jackets, shoes, etc.', 'checkroom'),
('Accessories', 'Watches, jewelry, bags, etc.', 'watch'),
('Documents', 'IDs, certificates, papers, etc.', 'description'),
('Books', 'Textbooks, notebooks, etc.', 'menu_book'),
('Sports', 'Balls, equipment, gear, etc.', 'sports'),
('Keys', 'House keys, car keys, etc.', 'vpn_key'),
('Other', 'Items that don''t fit other categories', 'category')
ON CONFLICT (name) DO NOTHING;
`;

    // Create SQL file for manual execution
    const databaseDir = path.join(__dirname, "..", "database");
    const sqlFilePath = path.join(databaseDir, "setup_schema.sql");

    // Ensure database directory exists
    if (!fs.existsSync(databaseDir)) {
      fs.mkdirSync(databaseDir, { recursive: true });
    }

    // Write SQL to file
    fs.writeFileSync(sqlFilePath, setupSQL);

    console.log("📄 SQL schema file created:", sqlFilePath);

    // Try to use the MCP service to check if tables exist
    console.log("🔍 Checking current database status...");

    const tableCheck = await supabaseService.checkTablesExist();

    if (tableCheck && tableCheck.success === false) {
      console.log("⚠️  Tables do not exist yet. Manual setup required.");

      console.log("\n📋 MANUAL SETUP INSTRUCTIONS:");
      console.log("═══════════════════════════════════════");
      console.log("1. 🌐 Go to your Supabase project dashboard");
      console.log("2. 📝 Navigate to SQL Editor");
      console.log("3. 📋 Copy and paste the contents of the file:");
      console.log(`   📁 ${sqlFilePath}`);
      console.log("4. ▶️  Run the SQL script");
      console.log("5. ✅ Verify that all tables are created");
      console.log("═══════════════════════════════════════");

      console.log("\n📄 Alternatively, you can:");
      console.log(`   - Open: ${sqlFilePath}`);
      console.log("   - Copy all contents");
      console.log("   - Paste into Supabase SQL Editor");
      console.log("   - Execute the script");

      console.log("\n🔗 Supabase Dashboard: https://app.supabase.com/");
    } else {
      console.log("✅ Some tables may already exist.");
      console.log("📄 SQL file created for reference or updates.");
    }

    console.log("\n🎉 ClaimIT database setup preparation completed!");
    console.log(
      "📝 Please run the SQL script manually in Supabase SQL Editor."
    );
    console.log(
      "🔗 After running the script, restart your server to test the application."
    );
  } catch (error) {
    console.error("❌ Database setup preparation failed:", error.message);
    console.error("🔧 Full error:", error);
  } finally {
    process.exit(0);
  }
}

// Run the setup
setupSupabaseTables();

const express = require("express");
const multer = require("multer");
const ImageUploadService = require("../services/image-upload");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Initialize services
const imageUploadService = new ImageUploadService();

// Configure multer for test uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Test B2 connection
router.get("/b2/health", async (req, res) => {
  try {
    const backblaze = imageUploadService.backblaze;

    // Test basic connection by listing files (limited to 1)
    const listResult = await backblaze.listFiles("", 1);

    if (listResult.success) {
      res.json({
        status: "success",
        message: "Backblaze B2 connection is healthy",
        data: {
          connected: true,
          fileCount: listResult.data.files.length,
          bucket: process.env.B2_BUCKET_NAME,
          bucketType:
            process.env.B2_BUCKET_PRIVATE !== "false" ? "private" : "public",
        },
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to connect to Backblaze B2",
        error: listResult.error,
      });
    }
  } catch (error) {
    console.error("B2 health check error:", error);
    res.status(500).json({
      status: "error",
      message: "B2 health check failed",
      error: error.message,
    });
  }
});

// Test image upload without authentication (for testing only)
router.post(
  "/b2/test-upload-noauth",
  upload.single("testImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No image file provided",
        });
      }

      // Validate image
      const validation = imageUploadService.validateImageFile(req.file);
      if (!validation.valid) {
        return res.status(400).json({
          status: "error",
          message: validation.error,
        });
      }

      // Upload to B2 with test user ID
      const uploadResult = await imageUploadService.uploadImage(
        req.file.buffer,
        {
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          folder: "test",
          userId: "test-user-123",
        }
      );

      if (uploadResult.success) {
        res.json({
          status: "success",
          message: "Image uploaded successfully",
          data: uploadResult.data,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to upload image",
          error: uploadResult.error,
        });
      }
    } catch (error) {
      console.error("Test upload error:", error);
      res.status(500).json({
        status: "error",
        message: "Test upload failed",
        error: error.message,
      });
    }
  }
);

// Test image upload
router.post(
  "/b2/test-upload",
  authenticateToken,
  upload.single("testImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No image file provided",
        });
      }

      // Validate image
      const validation = imageUploadService.validateImageFile(req.file);
      if (!validation.valid) {
        return res.status(400).json({
          status: "error",
          message: validation.error,
        });
      }

      // Upload to B2
      const uploadResult = await imageUploadService.uploadImage(
        req.file.buffer,
        {
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          folder: "test",
          userId: req.user.id,
        }
      );

      if (uploadResult.success) {
        res.json({
          status: "success",
          message: "Image uploaded successfully",
          data: uploadResult.data,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to upload image",
          error: uploadResult.error,
        });
      }
    } catch (error) {
      console.error("Test upload error:", error);
      res.status(500).json({
        status: "error",
        message: "Test upload failed",
        error: error.message,
      });
    }
  }
);

// Test multiple image upload
router.post(
  "/b2/test-multiple",
  authenticateToken,
  upload.array("testImages", 3),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No image files provided",
        });
      }

      // Validate all images
      for (const file of req.files) {
        const validation = imageUploadService.validateImageFile(file);
        if (!validation.valid) {
          return res.status(400).json({
            status: "error",
            message: `File ${file.originalname}: ${validation.error}`,
          });
        }
      }

      // Prepare images for upload
      const imageUploads = req.files.map((file) => ({
        buffer: file.buffer,
        options: {
          originalName: file.originalname,
          mimeType: file.mimetype,
          folder: "test",
          userId: req.user.id,
        },
      }));

      // Upload to B2
      const uploadResult = await imageUploadService.uploadMultipleImages(
        imageUploads
      );

      res.json({
        status: uploadResult.success ? "success" : "partial_success",
        message: `Uploaded ${uploadResult.data.successCount}/${uploadResult.data.totalCount} images`,
        data: uploadResult.data,
      });
    } catch (error) {
      console.error("Test multiple upload error:", error);
      res.status(500).json({
        status: "error",
        message: "Test multiple upload failed",
        error: error.message,
      });
    }
  }
);

// Test image deletion
router.delete(
  "/b2/test-delete/:key(*)",
  authenticateToken,
  async (req, res) => {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          status: "error",
          message: "File key is required",
        });
      }

      // Only allow deletion of test files
      if (!key.startsWith("test/")) {
        return res.status(403).json({
          status: "error",
          message: "Can only delete test files",
        });
      }

      const deleteResult = await imageUploadService.deleteImage(key);

      if (deleteResult.success) {
        res.json({
          status: "success",
          message: "Image deleted successfully",
          data: { key },
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to delete image",
          error: deleteResult.error,
        });
      }
    } catch (error) {
      console.error("Test delete error:", error);
      res.status(500).json({
        status: "error",
        message: "Test delete failed",
        error: error.message,
      });
    }
  }
);

// Get storage info
router.get("/b2/storage-info", authenticateToken, async (req, res) => {
  try {
    const backblaze = imageUploadService.backblaze;
    const storageInfo = await backblaze.getStorageInfo();

    if (storageInfo.success) {
      res.json({
        status: "success",
        message: "Storage info retrieved successfully",
        data: storageInfo.data,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to get storage info",
        error: storageInfo.error,
      });
    }
  } catch (error) {
    console.error("Storage info error:", error);
    res.status(500).json({
      status: "error",
      message: "Storage info request failed",
      error: error.message,
    });
  }
});

// Refresh image URLs (useful for private buckets)
router.post("/b2/refresh-urls", authenticateToken, async (req, res) => {
  try {
    const { keys, expiresIn } = req.body;

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Array of file keys is required",
      });
    }

    const refreshResult = await imageUploadService.refreshImageUrls(
      keys,
      expiresIn
    );

    if (refreshResult.success) {
      res.json({
        status: "success",
        message: "URLs refreshed successfully",
        data: refreshResult.data,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to refresh URLs",
        error: refreshResult.error,
      });
    }
  } catch (error) {
    console.error("Refresh URLs error:", error);
    res.status(500).json({
      status: "error",
      message: "URL refresh failed",
      error: error.message,
    });
  }
});

// Add database setup endpoint
router.post("/setup-database", async (req, res) => {
  try {
    const mcpManager = req.app.get("mcpManager");

    if (!mcpManager) {
      return res.status(500).json({
        success: false,
        error: "MCP Manager not available",
      });
    }

    const supabaseService = mcpManager.getSupabase();

    if (!supabaseService) {
      return res.status(500).json({
        success: false,
        error: "Supabase MCP service not available",
      });
    }

    // Database schema SQL
    const setupSQL = `
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
`;

    console.log("📝 Executing database schema via API endpoint...");

    // Execute the schema setup
    const result = await supabaseService.executeSql(setupSQL);

    if (!result.success) {
      throw new Error(result.error);
    }

    console.log("✅ Database schema created successfully!");

    // Insert default categories
    const categoriesSQL = `
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

    const categoriesResult = await supabaseService.executeSql(categoriesSQL);

    let categoriesMessage = "Default categories inserted successfully!";
    if (!categoriesResult.success) {
      categoriesMessage = `Categories insertion warning: ${categoriesResult.error}`;
    }

    // Verify tables were created
    const verifySQL = `
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'items', 'claims', 'messages', 'notifications', 'categories')
ORDER BY table_name;
`;

    const verifyResult = await supabaseService.executeSql(verifySQL);

    res.json({
      success: true,
      message: "Database tables created successfully via MCP",
      schema: {
        tablesCreated: result.success
          ? "Schema executed"
          : "Tables already exist",
        categories: categoriesMessage,
        tablesVerified: verifyResult.success ? verifyResult.data || [] : [],
      },
    });
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
    });
  }
});

module.exports = router;

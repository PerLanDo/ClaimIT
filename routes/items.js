const express = require("express");
const multer = require("multer");
const QRCode = require("qrcode");
const { body, validationResult, query } = require("express-validator");
const { supabase } = require("../config/database");
const {
  authenticateToken,
  requireStudentOrStaff,
} = require("../middleware/auth");
const ImageUploadService = require("../services/image-upload");

const router = express.Router();

// Initialize image upload service
const imageUploadService = new ImageUploadService();

// Configure multer for image uploads
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

// Get all items with filters
router.get(
  "/",
  authenticateToken,
  [
    query("status").optional().isIn(["active", "claimed", "archived"]),
    query("type").optional().isIn(["lost", "found", "all"]),
    query("category").optional().isUUID(),
    query("location").optional().isString(),
    query("search").optional().isString(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        status = "active",
        type = "all",
        category,
        location,
        search,
        page = 1,
        limit = 20,
      } = req.query;

      let query = supabase
        .from("items")
        .select(
          `
        *,
        categories(name, icon),
        poster:users!items_poster_id_fkey(id, full_name, role),
        claimed_by_user:users!items_claimed_by_fkey(id, full_name)
      `
        )
        .order("created_at", { ascending: false });

      // Apply status filter
      if (status !== "all") {
        query = query.eq("status", status);
      }

      // Apply type filter (lost/found)
      if (type === "lost") {
        query = query.not("date_lost", "is", null);
      } else if (type === "found") {
        query = query.not("date_found", "is", null);
      }

      // Apply category filter
      if (category) {
        query = query.eq("category_id", category);
      }

      // Apply location filter
      if (location) {
        query = query.ilike("location", `%${location}%`);
      }

      // Apply search filter
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data: items, error, count } = await query;

      if (error) {
        console.error("Get items error:", error);
        return res.status(500).json({ error: "Failed to fetch items" });
      }

      res.json({
        items,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      });
    } catch (error) {
      console.error("Get items error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get single item by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { data: item, error } = await supabase
      .from("items")
      .select(
        `
        *,
        categories(name, icon, description),
        poster:users!items_poster_id_fkey(id, full_name, role, department),
        claimed_by_user:users!items_claimed_by_fkey(id, full_name, role)
      `
      )
      .eq("id", req.params.id)
      .single();

    if (error || !item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new item
router.post(
  "/",
  authenticateToken,
  requireStudentOrStaff,
  upload.array("images", 5),
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Title is required"),
    body("description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required"),
    body("categoryId").isUUID().withMessage("Valid category ID is required"),
    body("location")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Location is required"),
    body("dateLost").optional().isISO8601().withMessage("Invalid date format"),
    body("dateFound").optional().isISO8601().withMessage("Invalid date format"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, categoryId, location, dateLost, dateFound } =
        req.body;

      // Validate that either dateLost or dateFound is provided
      if (!dateLost && !dateFound) {
        return res.status(400).json({
          error: "Either date lost or date found must be provided",
        });
      }

      // Upload images to Backblaze B2
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        try {
          const imageUploads = req.files.map((file) => ({
            buffer: file.buffer,
            options: {
              originalName: file.originalname,
              mimeType: file.mimetype,
              folder: "items",
              userId: req.user.id,
            },
          }));

          const uploadResult = await imageUploadService.uploadMultipleImages(
            imageUploads
          );

          if (uploadResult.success) {
            imageUrls.push(
              ...uploadResult.data.uploaded.map((upload) => upload.url)
            );

            // Log any failed uploads
            if (uploadResult.data.failed.length > 0) {
              console.warn(
                "Some images failed to upload:",
                uploadResult.data.failed
              );
            }
          } else {
            console.error("Image upload failed:", uploadResult.error);
            return res.status(500).json({
              error: "Failed to upload images. Please try again.",
            });
          }
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          return res.status(500).json({
            error: "Failed to upload images. Please try again.",
          });
        }
      }

      // Generate QR code
      const itemData = {
        id: "", // Will be set after item creation
        title,
        location,
        date: dateLost || dateFound,
      };

      let qrCodeDataUrl;
      try {
        qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(itemData));
      } catch (qrError) {
        console.error("QR code generation error:", qrError);
      }

      // Create item
      const { data: newItem, error } = await supabase
        .from("items")
        .insert([
          {
            title,
            description,
            category_id: categoryId,
            location,
            date_lost: dateLost || null,
            date_found: dateFound || null,
            image_urls: imageUrls,
            poster_id: req.user.id,
            qr_code: qrCodeDataUrl,
          },
        ])
        .select(
          `
        *,
        categories(name, icon),
        poster:users!items_poster_id_fkey(id, full_name, role)
      `
        )
        .single();

      if (error) {
        console.error("Create item error:", error);
        return res.status(500).json({ error: "Failed to create item" });
      }

      // Update QR code with actual item ID
      if (qrCodeDataUrl) {
        itemData.id = newItem.id;
        try {
          const updatedQrCode = await QRCode.toDataURL(
            JSON.stringify(itemData)
          );
          await supabase
            .from("items")
            .update({ qr_code: updatedQrCode })
            .eq("id", newItem.id);
        } catch (qrError) {
          console.error("QR code update error:", qrError);
        }
      }

      // Award points for reporting found items
      if (dateFound) {
        await supabase
          .from("users")
          .update({ points: req.user.points + 10 })
          .eq("id", req.user.id);
      }

      res.status(201).json({
        message: "Item created successfully",
        item: newItem,
      });
    } catch (error) {
      console.error("Create item error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update item (only by poster or admin)
router.put(
  "/:id",
  authenticateToken,
  upload.array("images", 5),
  [
    body("title").optional().trim().isLength({ min: 1, max: 255 }),
    body("description").optional().trim().isLength({ min: 1 }),
    body("categoryId").optional().isUUID(),
    body("location").optional().trim().isLength({ min: 1 }),
    body("status").optional().isIn(["active", "claimed", "archived"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updates = {};

      // Get current item to check permissions
      const { data: currentItem, error: fetchError } = await supabase
        .from("items")
        .select("poster_id")
        .eq("id", id)
        .single();

      if (fetchError || !currentItem) {
        return res.status(404).json({ error: "Item not found" });
      }

      // Check if user can update this item
      if (currentItem.poster_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Permission denied" });
      }

      // Build updates object
      if (req.body.title) updates.title = req.body.title;
      if (req.body.description) updates.description = req.body.description;
      if (req.body.categoryId) updates.category_id = req.body.categoryId;
      if (req.body.location) updates.location = req.body.location;
      if (req.body.status && req.user.role === "admin")
        updates.status = req.body.status;

      // Handle image updates
      if (req.files && req.files.length > 0) {
        try {
          // Get current item to access existing images for potential cleanup
          const { data: fullCurrentItem } = await supabase
            .from("items")
            .select("image_urls")
            .eq("id", id)
            .single();

          const imageUploads = req.files.map((file) => ({
            buffer: file.buffer,
            options: {
              originalName: file.originalname,
              mimeType: file.mimetype,
              folder: "items",
              userId: req.user.id,
            },
          }));

          const uploadResult = await imageUploadService.uploadMultipleImages(
            imageUploads
          );

          if (uploadResult.success) {
            const newImageUrls = uploadResult.data.uploaded.map(
              (upload) => upload.url
            );
            updates.image_urls = newImageUrls;

            // Optional: Clean up old images if replacing all images
            if (
              fullCurrentItem &&
              fullCurrentItem.image_urls &&
              fullCurrentItem.image_urls.length > 0
            ) {
              try {
                const oldKeys = imageUploadService.extractKeysFromUrls(
                  fullCurrentItem.image_urls
                );
                if (oldKeys.length > 0) {
                  await imageUploadService.deleteMultipleImages(oldKeys);
                }
              } catch (cleanupError) {
                console.warn("Failed to cleanup old images:", cleanupError);
                // Don't fail the update if cleanup fails
              }
            }

            // Log any failed uploads
            if (uploadResult.data.failed.length > 0) {
              console.warn(
                "Some images failed to upload:",
                uploadResult.data.failed
              );
            }
          } else {
            console.error("Image upload failed:", uploadResult.error);
            return res.status(500).json({
              error: "Failed to upload images. Please try again.",
            });
          }
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          return res.status(500).json({
            error: "Failed to upload images. Please try again.",
          });
        }
      }

      const { data: updatedItem, error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id)
        .select(
          `
        *,
        categories(name, icon),
        poster:users!items_poster_id_fkey(id, full_name, role)
      `
        )
        .single();

      if (error) {
        console.error("Update item error:", error);
        return res.status(500).json({ error: "Failed to update item" });
      }

      res.json({
        message: "Item updated successfully",
        item: updatedItem,
      });
    } catch (error) {
      console.error("Update item error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete item (only by poster or admin)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get current item to check permissions
    const { data: currentItem, error: fetchError } = await supabase
      .from("items")
      .select("poster_id")
      .eq("id", id)
      .single();

    if (fetchError || !currentItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if user can delete this item
    if (currentItem.poster_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error("Delete item error:", error);
      return res.status(500).json({ error: "Failed to delete item" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get categories
router.get("/categories/list", authenticateToken, async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Get categories error:", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }

    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

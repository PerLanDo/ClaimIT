const { v4: uuidv4 } = require("uuid");
const MCPManager = require("./mcp-manager");

class ImageUploadService {
  constructor() {
    this.mcpManager = new MCPManager();
    this.backblaze = this.mcpManager.getBackblaze();
    // Check if bucket is configured as private (default: private for security)
    this.isPrivateBucket = process.env.B2_BUCKET_PRIVATE !== "false";
    // Default presigned URL expiration (24 hours for private buckets)
    this.defaultUrlExpiry = parseInt(process.env.B2_URL_EXPIRY || "86400"); // 24 hours
  }

  /**
   * Upload a single image to Backblaze B2
   * @param {Buffer} imageBuffer - The image buffer
   * @param {Object} options - Upload options
   * @param {string} options.originalName - Original filename
   * @param {string} options.mimeType - MIME type of the image
   * @param {string} options.folder - Folder path (e.g., 'items', 'claims', 'profiles')
   * @param {string} options.userId - User ID for organizing files
   * @returns {Promise<Object>} Upload result with URL
   */
  async uploadImage(imageBuffer, options = {}) {
    try {
      const {
        originalName = "image.jpg",
        mimeType = "image/jpeg",
        folder = "general",
        userId = "anonymous",
      } = options;

      // Generate unique filename
      const fileExtension = this.getFileExtension(originalName, mimeType);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const key = `${folder}/${userId}/${uniqueFilename}`;

      // Upload to Backblaze B2
      const uploadResult = await this.backblaze.uploadImage(key, imageBuffer, {
        contentType: mimeType,
        originalName,
        metadata: {
          userId,
          folder,
          uploadedAt: new Date().toISOString(),
          originalName,
        },
      });

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Generate URL based on bucket privacy setting
      let urlResult;
      if (this.isPrivateBucket) {
        // Generate presigned URL for private bucket access
        urlResult = await this.backblaze.generatePresignedUrl(
          key,
          "getObject",
          this.defaultUrlExpiry
        );
      } else {
        // Generate public URL for public bucket access
        urlResult = await this.backblaze.generatePublicUrl(key);
      }

      if (!urlResult.success) {
        throw new Error(urlResult.error);
      }

      return {
        success: true,
        data: {
          key,
          url: urlResult.data.url,
          filename: uniqueFilename,
          originalName,
          mimeType,
          size: imageBuffer.length,
          isPrivate: this.isPrivateBucket,
          expiresAt: this.isPrivateBucket
            ? new Date(Date.now() + this.defaultUrlExpiry * 1000).toISOString()
            : null,
        },
      };
    } catch (error) {
      console.error("Image upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Upload multiple images to Backblaze B2
   * @param {Array} images - Array of image objects with buffer and options
   * @returns {Promise<Object>} Upload results
   */
  async uploadMultipleImages(images) {
    try {
      const results = [];
      const failed = [];

      for (const image of images) {
        const result = await this.uploadImage(image.buffer, image.options);

        if (result.success) {
          results.push(result.data);
        } else {
          failed.push({
            originalName: image.options?.originalName || "unknown",
            error: result.error,
          });
        }
      }

      return {
        success: true,
        data: {
          uploaded: results,
          failed,
          totalCount: images.length,
          successCount: results.length,
          failureCount: failed.length,
        },
      };
    } catch (error) {
      console.error("Multiple image upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete an image from Backblaze B2
   * @param {string} key - The file key/path
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(key) {
    try {
      const result = await this.backblaze.deleteFile(key);
      return result;
    } catch (error) {
      console.error("Image deletion error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete multiple images from Backblaze B2
   * @param {Array<string>} keys - Array of file keys/paths
   * @returns {Promise<Object>} Deletion results
   */
  async deleteMultipleImages(keys) {
    try {
      const result = await this.backblaze.deleteMultipleFiles(keys);
      return result;
    } catch (error) {
      console.error("Multiple image deletion error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get file extension from filename or MIME type
   * @param {string} filename - Original filename
   * @param {string} mimeType - MIME type
   * @returns {string} File extension with dot
   */
  getFileExtension(filename, mimeType) {
    // Try to get extension from filename first
    if (filename && filename.includes(".")) {
      const ext = filename.split(".").pop().toLowerCase();
      if (this.isValidImageExtension(ext)) {
        return `.${ext}`;
      }
    }

    // Fallback to MIME type
    const mimeExtensions = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/bmp": ".bmp",
      "image/tiff": ".tiff",
    };

    return mimeExtensions[mimeType] || ".jpg";
  }

  /**
   * Check if file extension is valid for images
   * @param {string} extension - File extension without dot
   * @returns {boolean} True if valid image extension
   */
  isValidImageExtension(extension) {
    const validExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "bmp",
      "tiff",
    ];
    return validExtensions.includes(extension.toLowerCase());
  }

  /**
   * Validate image file
   * @param {Object} file - Multer file object
   * @returns {Object} Validation result
   */
  validateImageFile(file) {
    if (!file) {
      return {
        valid: false,
        error: "No file provided",
      };
    }

    if (!file.mimetype.startsWith("image/")) {
      return {
        valid: false,
        error: "File must be an image",
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size must be less than 5MB",
      };
    }

    return {
      valid: true,
    };
  }

  /**
   * Extract image URLs from existing array and return keys for deletion
   * @param {Array<string>} imageUrls - Array of image URLs
   * @returns {Array<string>} Array of file keys
   */
  extractKeysFromUrls(imageUrls) {
    if (!Array.isArray(imageUrls)) {
      return [];
    }

    return imageUrls
      .filter((url) => url && typeof url === "string")
      .map((url) => {
        // Extract key from B2 URL
        // URL format: https://s3.us-west-004.backblazeb2.com/bucket-name/key
        try {
          const urlParts = url.split("/");
          // Remove protocol, domain, and bucket name to get the key
          return urlParts.slice(4).join("/");
        } catch (error) {
          console.warn("Failed to extract key from URL:", url);
          return null;
        }
      })
      .filter((key) => key !== null);
  }

  /**
   * Generate presigned URL for temporary access
   * @param {string} key - File key
   * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
   * @returns {Promise<Object>} Presigned URL result
   */
  async generatePresignedUrl(key, expiresIn = 3600) {
    try {
      const result = await this.backblaze.generatePresignedUrl(
        key,
        "getObject",
        expiresIn
      );
      return result;
    } catch (error) {
      console.error("Presigned URL generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Refresh URLs for images (useful for private buckets with expired presigned URLs)
   * @param {Array<string>} keys - Array of file keys
   * @param {number} expiresIn - Expiration time in seconds
   * @returns {Promise<Object>} Refreshed URLs
   */
  async refreshImageUrls(keys, expiresIn = null) {
    try {
      const expiry = expiresIn || this.defaultUrlExpiry;
      const results = [];

      for (const key of keys) {
        if (this.isPrivateBucket) {
          const urlResult = await this.backblaze.generatePresignedUrl(
            key,
            "getObject",
            expiry
          );
          if (urlResult.success) {
            results.push({
              key,
              url: urlResult.data.url,
              expiresAt: new Date(Date.now() + expiry * 1000).toISOString(),
            });
          } else {
            results.push({
              key,
              error: urlResult.error,
            });
          }
        } else {
          const urlResult = await this.backblaze.generatePublicUrl(key);
          if (urlResult.success) {
            results.push({
              key,
              url: urlResult.data.url,
              expiresAt: null, // Public URLs don't expire
            });
          } else {
            results.push({
              key,
              error: urlResult.error,
            });
          }
        }
      }

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      console.error("Refresh URLs error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = ImageUploadService;

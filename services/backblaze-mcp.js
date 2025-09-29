const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

class BackblazeMCP {
  constructor() {
    this.s3Client = new S3Client({
      region: 'us-west-004', // Backblaze B2 region
      endpoint: process.env.B2_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com',
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
      }
    });
    this.bucketName = process.env.B2_BUCKET_NAME;
  }

  // File upload operations
  async uploadFile(key, file, options = {}) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: options.contentType || 'application/octet-stream',
        Metadata: options.metadata || {},
        ACL: options.acl || 'private'
      });

      const result = await this.s3Client.send(command);
      return { 
        success: true, 
        data: {
          key,
          etag: result.ETag,
          location: result.Location
        }
      };
    } catch (error) {
      console.error('Backblaze upload error:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadBuffer(key, buffer, options = {}) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: options.contentType || 'application/octet-stream',
        Metadata: options.metadata || {},
        ACL: options.acl || 'private'
      });

      const result = await this.s3Client.send(command);
      return { 
        success: true, 
        data: {
          key,
          etag: result.ETag,
          location: result.Location
        }
      };
    } catch (error) {
      console.error('Backblaze upload buffer error:', error);
      return { success: false, error: error.message };
    }
  }

  // File download operations
  async downloadFile(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const result = await this.s3Client.send(command);
      return { 
        success: true, 
        data: {
          body: result.Body,
          contentType: result.ContentType,
          contentLength: result.ContentLength,
          lastModified: result.LastModified,
          metadata: result.Metadata
        }
      };
    } catch (error) {
      console.error('Backblaze download error:', error);
      return { success: false, error: error.message };
    }
  }

  // File management operations
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
      return { success: true };
    } catch (error) {
      console.error('Backblaze delete error:', error);
      return { success: false, error: error.message };
    }
  }

  async fileExists(key) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
      return { success: true, exists: true };
    } catch (error) {
      if (error.name === 'NotFound') {
        return { success: true, exists: false };
      }
      console.error('Backblaze file exists check error:', error);
      return { success: false, error: error.message };
    }
  }

  async getFileMetadata(key) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const result = await this.s3Client.send(command);
      return { 
        success: true, 
        data: {
          contentType: result.ContentType,
          contentLength: result.ContentLength,
          lastModified: result.LastModified,
          etag: result.ETag,
          metadata: result.Metadata
        }
      };
    } catch (error) {
      console.error('Backblaze get metadata error:', error);
      return { success: false, error: error.message };
    }
  }

  // List operations
  async listFiles(prefix = '', maxKeys = 1000) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys
      });

      const result = await this.s3Client.send(command);
      return { 
        success: true, 
        data: {
          files: result.Contents || [],
          isTruncated: result.IsTruncated,
          nextContinuationToken: result.NextContinuationToken
        }
      };
    } catch (error) {
      console.error('Backblaze list files error:', error);
      return { success: false, error: error.message };
    }
  }

  // URL generation
  async generatePresignedUrl(key, operation = 'getObject', expiresIn = 3600) {
    try {
      let command;
      
      switch (operation) {
        case 'getObject':
          command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
          });
          break;
        case 'putObject':
          command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key
          });
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return { success: true, data: { url } };
    } catch (error) {
      console.error('Backblaze generate presigned URL error:', error);
      return { success: false, error: error.message };
    }
  }

  async generatePublicUrl(key) {
    try {
      const url = `${this.s3Client.config.endpoint()}/${this.bucketName}/${key}`;
      return { success: true, data: { url } };
    } catch (error) {
      console.error('Backblaze generate public URL error:', error);
      return { success: false, error: error.message };
    }
  }

  // Batch operations
  async deleteMultipleFiles(keys) {
    try {
      const results = [];
      
      for (const key of keys) {
        const result = await this.deleteFile(key);
        results.push({ key, ...result });
      }
      
      return { success: true, data: results };
    } catch (error) {
      console.error('Backblaze delete multiple files error:', error);
      return { success: false, error: error.message };
    }
  }

  // Image processing helpers
  async uploadImage(key, imageBuffer, options = {}) {
    const contentType = options.contentType || 'image/jpeg';
    const metadata = {
      ...options.metadata,
      uploadedAt: new Date().toISOString(),
      originalName: options.originalName || key
    };

    return await this.uploadBuffer(key, imageBuffer, {
      contentType,
      metadata,
      ...options
    });
  }

  // File size and storage info
  async getStorageInfo() {
    try {
      const result = await this.listFiles('', 1000);
      
      if (!result.success) {
        return result;
      }

      let totalSize = 0;
      let fileCount = 0;

      result.data.files.forEach(file => {
        totalSize += file.Size || 0;
        fileCount++;
      });

      return {
        success: true,
        data: {
          totalSize,
          fileCount,
          files: result.data.files
        }
      };
    } catch (error) {
      console.error('Backblaze get storage info error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = BackblazeMCP;


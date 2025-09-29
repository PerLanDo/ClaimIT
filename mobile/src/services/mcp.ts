import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Backblaze B2 configuration
const b2Endpoint = process.env.EXPO_PUBLIC_B2_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com';
const b2BucketName = process.env.EXPO_PUBLIC_B2_BUCKET_NAME || '';

export class MCPService {
  private supabase: SupabaseClient;
  private s3Client: S3Client;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Initialize S3 client for Backblaze B2
    this.s3Client = new S3Client({
      region: 'us-west-004',
      endpoint: b2Endpoint,
      credentials: {
        accessKeyId: process.env.EXPO_PUBLIC_B2_KEY_ID || '',
        secretAccessKey: process.env.EXPO_PUBLIC_B2_APPLICATION_KEY || ''
      }
    });
  }

  // Supabase operations
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  async signUp(email: string, password: string, metadata?: any) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Supabase sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return { success: true, data: user };
    } catch (error) {
      console.error('Supabase get current user error:', error);
      return { success: false, error: error.message };
    }
  }

  async query(table: string, options: any = {}) {
    try {
      let query = this.supabase.from(table);
      
      if (options.select) {
        query = query.select(options.select);
      }
      
      if (options.filters) {
        options.filters.forEach((filter: any) => {
          query = query.eq(filter.column, filter.value);
        });
      }
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase query error:', error);
      return { success: false, error: error.message };
    }
  }

  async insert(table: string, data: any) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data)
        .select();
      
      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }
  }

  async update(table: string, id: string, data: any) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('Supabase update error:', error);
      return { success: false, error: error.message };
    }
  }

  async delete(table: string, id: string) {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Supabase delete error:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time subscriptions
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();
  }

  // Backblaze B2 file operations
  async uploadFile(key: string, file: File | Blob, options: any = {}) {
    try {
      const command = new PutObjectCommand({
        Bucket: b2BucketName,
        Key: key,
        Body: file,
        ContentType: options.contentType || 'application/octet-stream',
        Metadata: options.metadata || {}
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

  async downloadFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: b2BucketName,
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

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: b2BucketName,
        Key: key
      });

      await this.s3Client.send(command);
      return { success: true };
    } catch (error) {
      console.error('Backblaze delete error:', error);
      return { success: false, error: error.message };
    }
  }

  async generatePresignedUrl(key: string, operation: 'getObject' | 'putObject' = 'getObject', expiresIn: number = 3600) {
    try {
      let command;
      
      switch (operation) {
        case 'getObject':
          command = new GetObjectCommand({
            Bucket: b2BucketName,
            Key: key
          });
          break;
        case 'putObject':
          command = new PutObjectCommand({
            Bucket: b2BucketName,
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

  async generatePublicUrl(key: string) {
    try {
      const url = `${b2Endpoint}/${b2BucketName}/${key}`;
      return { success: true, data: { url } };
    } catch (error) {
      console.error('Backblaze generate public URL error:', error);
      return { success: false, error: error.message };
    }
  }

  // Image upload helper
  async uploadImage(key: string, imageBlob: Blob, options: any = {}) {
    const contentType = options.contentType || 'image/jpeg';
    const metadata = {
      ...options.metadata,
      uploadedAt: new Date().toISOString(),
      originalName: options.originalName || key
    };

    return await this.uploadFile(key, imageBlob, {
      contentType,
      metadata,
      ...options
    });
  }

  // Health check
  async healthCheck() {
    const results = {
      supabase: { status: 'unknown', error: null },
      backblaze: { status: 'unknown', error: null }
    };

    // Test Supabase connection
    try {
      const supabaseTest = await this.getCurrentUser();
      results.supabase.status = supabaseTest.success ? 'healthy' : 'unhealthy';
      results.supabase.error = supabaseTest.error;
    } catch (error) {
      results.supabase.status = 'unhealthy';
      results.supabase.error = error.message;
    }

    // Test Backblaze connection
    try {
      const backblazeTest = await this.generatePublicUrl('test');
      results.backblaze.status = backblazeTest.success ? 'healthy' : 'unhealthy';
      results.backblaze.error = backblazeTest.error;
    } catch (error) {
      results.backblaze.status = 'unhealthy';
      results.backblaze.error = error.message;
    }

    return {
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const mcpService = new MCPService();
export default mcpService;
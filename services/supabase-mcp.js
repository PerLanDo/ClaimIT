const { createClient } = require('@supabase/supabase-js');

class SupabaseMCP {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  // Database operations
  async query(table, options = {}) {
    try {
      let query = this.supabase.from(table);
      
      if (options.select) {
        query = query.select(options.select);
      }
      
      if (options.filters) {
        options.filters.forEach(filter => {
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

  async insert(table, data) {
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

  async update(table, id, data) {
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

  async delete(table, id) {
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

  // Authentication operations
  async createUser(userData) {
    try {
      const { data, error } = await this.supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: userData.metadata || {}
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase create user error:', error);
      return { success: false, error: error.message };
    }
  }

  async signInUser(email, password) {
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

  async signOutUser() {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Supabase sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time subscriptions
  subscribeToTable(table, callback) {
    return this.supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();
  }

  // Storage operations
  async uploadFile(bucket, path, file) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase upload error:', error);
      return { success: false, error: error.message };
    }
  }

  async getPublicUrl(bucket, path) {
    try {
      const { data } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return { success: true, data };
    } catch (error) {
      console.error('Supabase get public URL error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteFile(bucket, path) {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Supabase delete file error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SupabaseMCP;


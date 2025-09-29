const { createClient } = require("@supabase/supabase-js");

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

      // Always add select, default to '*' if not specified
      query = query.select(options.select || "*");

      if (options.filters) {
        options.filters.forEach((filter) => {
          query = query.eq(filter.column, filter.value);
        });
      }

      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Supabase query error:", error);
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
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }
  }

  async update(table, id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data)
        .eq("id", id)
        .select();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: error.message };
    }
  }

  async delete(table, id) {
    try {
      const { error } = await this.supabase.from(table).delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }
  }

  // Authentication operations
  async createUser(userData) {
    try {
      const { data, error } = await this.supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: userData.metadata || {},
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Supabase create user error:", error);
      return { success: false, error: error.message };
    }
  }

  async signInUser(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Supabase sign in error:", error);
      return { success: false, error: error.message };
    }
  }

  async signOutUser() {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Supabase sign out error:", error);
      return { success: false, error: error.message };
    }
  }

  // Real-time subscriptions
  subscribeToTable(table, callback) {
    return this.supabase
      .channel(`${table}_changes`)
      .on("postgres_changes", { event: "*", schema: "public", table }, callback)
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
      console.error("Supabase upload error:", error);
      return { success: false, error: error.message };
    }
  }

  async getPublicUrl(bucket, path) {
    try {
      const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);

      return { success: true, data };
    } catch (error) {
      console.error("Supabase get public URL error:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteFile(bucket, path) {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Supabase delete file error:", error);
      return { success: false, error: error.message };
    }
  }

  // SQL execution method for creating tables and running raw SQL
  async executeSql(sql) {
    try {
      const { data, error } = await this.supabase.rpc("execute_sql", {
        sql_query: sql,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Supabase SQL execution error:", error);
      return { success: false, error: error.message };
    }
  }

  // Method to create tables using direct SQL execution
  async createTables() {
    try {
      console.log("Creating database tables...");

      // Create users table
      const usersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          phone VARCHAR(20),
          student_id VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      // Create items table
      const itemsTableSql = `
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
      `;

      // Create claims table
      const claimsTableSql = `
        CREATE TABLE IF NOT EXISTS claims (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          item_id UUID REFERENCES items(id),
          claimant_id UUID REFERENCES users(id),
          claim_description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      // Create messages table
      const messagesTableSql = `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          claim_id UUID REFERENCES claims(id),
          sender_id UUID REFERENCES users(id),
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      return {
        success: false,
        error:
          "DDL commands cannot be executed through Supabase JS client directly. Please run the SQL script manually.",
        instructions: [
          "1. Go to your Supabase project dashboard",
          "2. Navigate to SQL Editor",
          "3. Run the SQL script located at: database/create_tables.sql",
          "4. Or copy and run the following SQL commands:",
        ],
        sqlScript: "database/create_tables.sql",
        manualSteps:
          "The SQL file has been created in your project. Please execute it in Supabase SQL Editor.",
      };
    } catch (error) {
      console.error("Error creating tables:", error);
      return { success: false, error: error.message };
    }
  }

  // Method to check if tables exist
  async checkTablesExist() {
    try {
      console.log("Checking if database tables exist...");

      const tables = ["users", "items", "claims", "messages"];
      const tableStatus = {};

      for (const table of tables) {
        try {
          // Try to query the table with limit 0 to check if it exists
          const { data, error } = await this.supabase
            .from(table)
            .select("*")
            .limit(0);

          if (error) {
            tableStatus[table] = { exists: false, error: error.message };
          } else {
            tableStatus[table] = { exists: true, error: null };
          }
        } catch (err) {
          tableStatus[table] = { exists: false, error: err.message };
        }
      }

      const allTablesExist = Object.values(tableStatus).every(
        (status) => status.exists
      );

      return {
        success: true,
        data: {
          allTablesExist,
          tables: tableStatus,
          summary: `${
            Object.values(tableStatus).filter((s) => s.exists).length
          }/${tables.length} tables exist`,
        },
      };
    } catch (error) {
      console.error("Error checking tables:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SupabaseMCP;

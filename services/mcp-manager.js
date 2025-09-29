const SupabaseMCP = require('./supabase-mcp');
const VercelMCP = require('./vercel-mcp');
const BackblazeMCP = require('./backblaze-mcp');

class MCPManager {
  constructor() {
    this.supabase = new SupabaseMCP();
    this.vercel = new VercelMCP();
    this.backblaze = new BackblazeMCP();
  }

  // Supabase operations
  getSupabase() {
    return this.supabase;
  }

  // Vercel operations
  getVercel() {
    return this.vercel;
  }

  // Backblaze operations
  getBackblaze() {
    return this.backblaze;
  }

  // Health check for all services
  async healthCheck() {
    const results = {
      supabase: { status: 'unknown', error: null },
      vercel: { status: 'unknown', error: null },
      backblaze: { status: 'unknown', error: null }
    };

    // Test Supabase connection
    try {
      const supabaseTest = await this.supabase.query('users', { limit: 1 });
      results.supabase.status = supabaseTest.success ? 'healthy' : 'unhealthy';
      results.supabase.error = supabaseTest.error;
    } catch (error) {
      results.supabase.status = 'unhealthy';
      results.supabase.error = error.message;
    }

    // Test Vercel connection
    try {
      const vercelTest = await this.vercel.listProjects();
      results.vercel.status = vercelTest.success ? 'healthy' : 'unhealthy';
      results.vercel.error = vercelTest.error;
    } catch (error) {
      results.vercel.status = 'unhealthy';
      results.vercel.error = error.message;
    }

    // Test Backblaze connection
    try {
      const backblazeTest = await this.backblaze.listFiles('', 1);
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

  // Initialize all services
  async initialize() {
    const healthCheck = await this.healthCheck();
    
    console.log('MCP Services Health Check:', healthCheck.data);
    
    return healthCheck;
  }

  // Get service status
  getServiceStatus() {
    return {
      supabase: {
        configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        url: process.env.SUPABASE_URL
      },
      vercel: {
        configured: !!(process.env.VERCEL_TOKEN && process.env.VERCEL_TEAM_ID),
        teamId: process.env.VERCEL_TEAM_ID
      },
      backblaze: {
        configured: !!(process.env.B2_KEY_ID && process.env.B2_APPLICATION_KEY && process.env.B2_BUCKET_NAME),
        bucket: process.env.B2_BUCKET_NAME,
        endpoint: process.env.B2_ENDPOINT
      }
    };
  }
}

module.exports = MCPManager;


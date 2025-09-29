// Using Vercel REST API
const https = require('https');

class VercelMCP {
  constructor() {
    this.token = process.env.VERCEL_TOKEN;
    this.teamId = process.env.VERCEL_TEAM_ID;
    this.baseUrl = 'https://api.vercel.com';
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      if (this.teamId) {
        url.searchParams.append('teamId', this.teamId);
      }

      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(parsed.error || `HTTP ${res.statusCode}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Project operations
  async listProjects() {
    try {
      const projects = await this.makeRequest('/v1/projects');
      return { success: true, data: projects };
    } catch (error) {
      console.error('Vercel list projects error:', error);
      return { success: false, error: error.message };
    }
  }

  async getProject(projectId) {
    try {
      const project = await this.makeRequest(`/v1/projects/${projectId}`);
      return { success: true, data: project };
    } catch (error) {
      console.error('Vercel get project error:', error);
      return { success: false, error: error.message };
    }
  }

  // Deployment operations
  async listDeployments(projectId) {
    try {
      const deployments = await this.makeRequest(`/v1/deployments?projectId=${projectId}`);
      return { success: true, data: deployments };
    } catch (error) {
      console.error('Vercel list deployments error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDeployment(deploymentId) {
    try {
      const deployment = await this.makeRequest(`/v1/deployments/${deploymentId}`);
      return { success: true, data: deployment };
    } catch (error) {
      console.error('Vercel get deployment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Environment variables
  async getEnvironmentVariables(projectId) {
    try {
      const envVars = await this.makeRequest(`/v1/projects/${projectId}/env`);
      return { success: true, data: envVars };
    } catch (error) {
      console.error('Vercel get environment variables error:', error);
      return { success: false, error: error.message };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const projects = await this.listProjects();
      return { success: true, data: { status: 'healthy', projects: projects.data } };
    } catch (error) {
      console.error('Vercel health check error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = VercelMCP;
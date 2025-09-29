const { Vercel } = require('@vercel/sdk');

class VercelMCP {
  constructor() {
    this.vercel = new Vercel({
      token: process.env.VERCEL_TOKEN,
      teamId: process.env.VERCEL_TEAM_ID
    });
  }

  // Project operations
  async createProject(projectData) {
    try {
      const project = await this.vercel.projects.create({
        name: projectData.name,
        framework: projectData.framework || 'nextjs',
        gitRepository: projectData.gitRepository,
        rootDirectory: projectData.rootDirectory,
        buildCommand: projectData.buildCommand,
        outputDirectory: projectData.outputDirectory,
        installCommand: projectData.installCommand,
        devCommand: projectData.devCommand
      });
      
      return { success: true, data: project };
    } catch (error) {
      console.error('Vercel create project error:', error);
      return { success: false, error: error.message };
    }
  }

  async getProject(projectId) {
    try {
      const project = await this.vercel.projects.get(projectId);
      return { success: true, data: project };
    } catch (error) {
      console.error('Vercel get project error:', error);
      return { success: false, error: error.message };
    }
  }

  async listProjects() {
    try {
      const projects = await this.vercel.projects.list();
      return { success: true, data: projects };
    } catch (error) {
      console.error('Vercel list projects error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProject(projectId, updates) {
    try {
      const project = await this.vercel.projects.update(projectId, updates);
      return { success: true, data: project };
    } catch (error) {
      console.error('Vercel update project error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteProject(projectId) {
    try {
      await this.vercel.projects.delete(projectId);
      return { success: true };
    } catch (error) {
      console.error('Vercel delete project error:', error);
      return { success: false, error: error.message };
    }
  }

  // Deployment operations
  async createDeployment(projectId, deploymentData) {
    try {
      const deployment = await this.vercel.deployments.create({
        projectId,
        ...deploymentData
      });
      
      return { success: true, data: deployment };
    } catch (error) {
      console.error('Vercel create deployment error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDeployment(deploymentId) {
    try {
      const deployment = await this.vercel.deployments.get(deploymentId);
      return { success: true, data: deployment };
    } catch (error) {
      console.error('Vercel get deployment error:', error);
      return { success: false, error: error.message };
    }
  }

  async listDeployments(projectId) {
    try {
      const deployments = await this.vercel.deployments.list({
        projectId
      });
      return { success: true, data: deployments };
    } catch (error) {
      console.error('Vercel list deployments error:', error);
      return { success: false, error: error.message };
    }
  }

  async cancelDeployment(deploymentId) {
    try {
      await this.vercel.deployments.cancel(deploymentId);
      return { success: true };
    } catch (error) {
      console.error('Vercel cancel deployment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Domain operations
  async addDomain(projectId, domain) {
    try {
      const result = await this.vercel.domains.create({
        projectId,
        name: domain
      });
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Vercel add domain error:', error);
      return { success: false, error: error.message };
    }
  }

  async removeDomain(domain) {
    try {
      await this.vercel.domains.delete(domain);
      return { success: true };
    } catch (error) {
      console.error('Vercel remove domain error:', error);
      return { success: false, error: error.message };
    }
  }

  async listDomains(projectId) {
    try {
      const domains = await this.vercel.domains.list({
        projectId
      });
      return { success: true, data: domains };
    } catch (error) {
      console.error('Vercel list domains error:', error);
      return { success: false, error: error.message };
    }
  }

  // Environment variables
  async setEnvironmentVariable(projectId, key, value, environments = ['production', 'preview', 'development']) {
    try {
      const envVar = await this.vercel.env.create({
        projectId,
        key,
        value,
        type: 'encrypted',
        target: environments
      });
      
      return { success: true, data: envVar };
    } catch (error) {
      console.error('Vercel set environment variable error:', error);
      return { success: false, error: error.message };
    }
  }

  async getEnvironmentVariables(projectId) {
    try {
      const envVars = await this.vercel.env.list(projectId);
      return { success: true, data: envVars };
    } catch (error) {
      console.error('Vercel get environment variables error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteEnvironmentVariable(projectId, envVarId) {
    try {
      await this.vercel.env.delete(projectId, envVarId);
      return { success: true };
    } catch (error) {
      console.error('Vercel delete environment variable error:', error);
      return { success: false, error: error.message };
    }
  }

  // Analytics
  async getAnalytics(projectId, options = {}) {
    try {
      const analytics = await this.vercel.analytics.get({
        projectId,
        ...options
      });
      
      return { success: true, data: analytics };
    } catch (error) {
      console.error('Vercel get analytics error:', error);
      return { success: false, error: error.message };
    }
  }

  // Functions
  async listFunctions(projectId) {
    try {
      const functions = await this.vercel.functions.list(projectId);
      return { success: true, data: functions };
    } catch (error) {
      console.error('Vercel list functions error:', error);
      return { success: false, error: error.message };
    }
  }

  async getFunctionLogs(projectId, functionId) {
    try {
      const logs = await this.vercel.functions.getLogs(projectId, functionId);
      return { success: true, data: logs };
    } catch (error) {
      console.error('Vercel get function logs error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = VercelMCP;


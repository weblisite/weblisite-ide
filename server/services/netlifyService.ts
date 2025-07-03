import fetch from 'node-fetch';

interface NetlifyUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

interface NetlifySite {
  id: string;
  name: string;
  url: string;
  admin_url: string;
  ssl_url: string;
  deploy_url: string;
  repo_url?: string;
  repo_branch?: string;
  build_command?: string;
  publish_directory?: string;
  created_at: string;
  updated_at: string;
}

interface NetlifyDeployment {
  id: string;
  url: string;
  deploy_url: string;
  admin_url: string;
  state: 'building' | 'ready' | 'error';
  created_at: string;
  updated_at: string;
}

interface NetlifyDeploymentInstructions {
  manual: boolean;
  instructions: string[];
  netlifyToml: string;
  connectUrl: string;
}

interface NetlifyValidation {
  valid: boolean;
  user: NetlifyUser;
  scopes: string[];
}

export class NetlifyService {
  private accessToken: string;
  private baseUrl = 'https://api.netlify.com/api/v1';
  
  constructor(accessToken?: string) {
    // Use environment variable if no token provided
    this.accessToken = accessToken || process.env.NETLIFY_ACCESS_TOKEN || '';
  }
  
  /**
   * Create deployment instructions for manual setup
   */
  async createDeploymentInstructions(
    githubRepoUrl: string,
    siteName?: string,
    buildCommand: string = 'npm run build',
    publishDirectory: string = 'dist'
  ): Promise<NetlifyDeploymentInstructions> {
    
    const netlifyToml = `
[build]
  publish = "${publishDirectory}"
  command = "${buildCommand}"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 5173
`;

    const instructions = [
      "🎯 **Automatic Deployment (Recommended):**",
      `1. Go to [Netlify](https://app.netlify.com/start) and click "New site from Git"`,
      `2. Choose "GitHub" and authorize Netlify to access your repositories`,
      `3. Select your repository: ${githubRepoUrl.split('/').slice(-2).join('/')}`,
      `4. Configure build settings:`,
      `   - Build command: \`${buildCommand}\``,
      `   - Publish directory: \`${publishDirectory}\``,
      `5. Click "Deploy site" and wait for the build to complete`,
      "",
      "📁 **Or add netlify.toml to your repository:**",
      "1. Create a file called `netlify.toml` in your repository root",
      "2. Copy the configuration shown below into the file",
      "3. Commit and push to GitHub",
      "4. Netlify will automatically detect and use these settings"
    ];

    return {
      manual: true,
      instructions,
      netlifyToml: netlifyToml.trim(),
      connectUrl: "https://app.netlify.com/start"
    };
  }
  
  /**
   * Validate Netlify token and get user info (if token provided)
   */
  async validateToken(): Promise<{ valid: boolean; user?: NetlifyUser; scopes: string[] }> {
    if (!this.accessToken) {
      return { valid: false, scopes: [] };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { valid: false, scopes: [] };
      }
      
      const user = await response.json() as any;
      
      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name || user.email,
          avatar_url: user.avatar_url || '',
        },
        scopes: [],
      };
    } catch (error: any) {
      console.error('Netlify token validation error:', error);
      return { valid: false, scopes: [] };
    }
  }
  
  /**
   * Get user's Netlify sites (if token provided)
   */
  async getSites(): Promise<NetlifySite[]> {
    if (!this.accessToken) {
      return [];
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/sites`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sites: ${response.statusText}`);
      }
      
      const sites = await response.json() as any[];
      
      return sites.map(site => ({
        id: site.id,
        name: site.name,
        url: site.url || site.ssl_url,
        admin_url: site.admin_url,
        ssl_url: site.ssl_url,
        deploy_url: site.deploy_url,
        repo_url: site.build_settings?.repo_url,
        repo_branch: site.build_settings?.repo_branch,
        build_command: site.build_settings?.cmd,
        publish_directory: site.build_settings?.dir,
        created_at: site.created_at,
        updated_at: site.updated_at,
      }));
    } catch (error: any) {
      console.error('Error fetching Netlify sites:', error);
      throw new Error(`Failed to fetch sites: ${error.message}`);
    }
  }
  
  /**
   * Create a new Netlify site from a GitHub repository (if service token configured)
   */
  async createSiteFromGitHub(
    githubRepoUrl: string,
    siteName?: string,
    buildCommand: string = 'npm run build',
    publishDirectory: string = 'dist',
    branch: string = 'main'
  ): Promise<NetlifySite | NetlifyDeploymentInstructions> {
    
    // If no access token, return manual instructions
    if (!this.accessToken) {
      return this.createDeploymentInstructions(githubRepoUrl, siteName, buildCommand, publishDirectory);
    }
    
    try {
      // Extract owner/repo from GitHub URL
      const repoMatch = githubRepoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
      if (!repoMatch) {
        throw new Error('Invalid GitHub repository URL');
      }
      
      const [, owner, repo] = repoMatch;
      const repoFullName = `${owner}/${repo}`;
      
      // Generate site name if not provided
      const finalSiteName = siteName || `${repo}-${Date.now()}`;
      
      const siteData = {
        name: finalSiteName,
        build_settings: {
          provider: 'github',
          repo_url: githubRepoUrl,
          repo_branch: branch,
          repo_path: '',
          cmd: buildCommand,
          dir: publishDirectory,
          env: {
            NODE_VERSION: '18',
            NPM_FLAGS: '--legacy-peer-deps'
          }
        },
        processing_settings: {
          skip: false,
          css: {
            bundle: true,
            minify: true
          },
          js: {
            bundle: true,
            minify: true
          },
          html: {
            pretty_urls: true
          }
        }
      };
      
      console.log('Creating Netlify site with data:', JSON.stringify(siteData, null, 2));
      
      const response = await fetch(`${this.baseUrl}/sites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteData),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Netlify site creation failed:', response.status, errorData);
        // Fall back to manual instructions if automatic creation fails
        return this.createDeploymentInstructions(githubRepoUrl, siteName, buildCommand, publishDirectory);
      }
      
      const site = await response.json() as any;
      
      console.log('Successfully created Netlify site:', site.id);
      
      return {
        id: site.id,
        name: site.name,
        url: site.url || site.ssl_url,
        admin_url: site.admin_url,
        ssl_url: site.ssl_url,
        deploy_url: site.deploy_url,
        repo_url: site.build_settings?.repo_url,
        repo_branch: site.build_settings?.repo_branch,
        build_command: site.build_settings?.cmd,
        publish_directory: site.build_settings?.dir,
        created_at: site.created_at,
        updated_at: site.updated_at,
      };
    } catch (error: any) {
      console.error('Error creating Netlify site from GitHub:', error);
      // Fall back to manual instructions if automatic creation fails
      return this.createDeploymentInstructions(githubRepoUrl, siteName, buildCommand, publishDirectory);
    }
  }
  
  /**
   * Trigger a new deployment for a site
   */
  async triggerDeploy(siteId: string): Promise<NetlifyDeployment> {
    try {
      const response = await fetch(`${this.baseUrl}/sites/${siteId}/builds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to trigger deployment: ${response.statusText} - ${errorData}`);
      }
      
      const deployment = await response.json() as any;
      
      return {
        id: deployment.id,
        url: deployment.url,
        deploy_url: deployment.deploy_url,
        admin_url: deployment.admin_url,
        state: deployment.state,
        created_at: deployment.created_at,
        updated_at: deployment.updated_at,
      };
    } catch (error: any) {
      console.error('Error triggering Netlify deployment:', error);
      throw new Error(`Failed to trigger deployment: ${error.message}`);
    }
  }
  
  /**
   * Get deployment status
   */
  async getDeployment(deployId: string): Promise<NetlifyDeployment> {
    try {
      const response = await fetch(`${this.baseUrl}/deploys/${deployId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get deployment: ${response.statusText}`);
      }
      
      const deployment = await response.json() as any;
      
      return {
        id: deployment.id,
        url: deployment.url,
        deploy_url: deployment.deploy_url,
        admin_url: deployment.admin_url,
        state: deployment.state,
        created_at: deployment.created_at,
        updated_at: deployment.updated_at,
      };
    } catch (error: any) {
      console.error('Error getting Netlify deployment:', error);
      throw new Error(`Failed to get deployment: ${error.message}`);
    }
  }
  
  /**
   * Delete a site
   */
  async deleteSite(siteId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sites/${siteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to delete site: ${response.statusText}`);
      }
      
      console.log('Successfully deleted Netlify site:', siteId);
    } catch (error: any) {
      console.error('Error deleting Netlify site:', error);
      throw new Error(`Failed to delete site: ${error.message}`);
    }
  }
} 
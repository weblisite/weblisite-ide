import fetch from 'node-fetch';
import { storage } from '../storage';
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import { Octokit } from '@octokit/rest';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  private: boolean;
  description?: string | null;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email?: string;
  avatar_url: string;
  html_url: string;
}

interface GitHubCommit {
  sha: string;
  html_url: string;
  message: string;
}

interface GitHubTree {
  sha: string;
  url: string;
}

interface GitHubValidation {
  valid: boolean;
  user: GitHubUser;
  scopes: string[];
  hasRepoAccess: boolean;
}

interface GitHubPushResult {
  repositoryUrl: string;
  commitUrl: string;
  success: boolean;
}

export class GitHubService {
  private projectDir: string;
  private tempDir: string;
  private accessToken: string;
  private octokit: Octokit;
  
  constructor(private projectId: number, accessToken: string) {
    this.projectDir = path.join(process.cwd(), 'project');
    this.tempDir = path.join(process.cwd(), 'temp');
    this.accessToken = accessToken;
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }
  
  /**
   * Validate GitHub token and get user info
   */
  async validateToken(): Promise<GitHubValidation> {
    try {
      const { data: user } = await this.octokit.rest.users.getAuthenticated();
      
      // Check token scopes
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      const scopes = response.headers.get('x-oauth-scopes')?.split(', ') || [];
      const hasRepoAccess = scopes.includes('repo') || scopes.includes('public_repo');
      
      return {
        valid: true,
        user: {
          id: user.id,
          login: user.login,
          name: user.name || user.login,
          email: user.email || undefined,
          avatar_url: user.avatar_url,
          html_url: user.html_url,
        },
        scopes,
        hasRepoAccess,
      };
    } catch (error: any) {
      console.error('GitHub token validation error:', error);
      throw new Error(`Invalid GitHub token: ${error.message}`);
    }
  }
  
  /**
   * Get user repositories
   */
  async getRepositories(): Promise<GitHubRepository[]> {
    try {
      const { data: repos } = await this.octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
      });
      
      return repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        default_branch: repo.default_branch,
        private: repo.private,
        description: repo.description || undefined,
      }));
    } catch (error: any) {
      console.error('Error fetching repositories:', error);
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }
  
  /**
   * Create a new repository
   */
  async createRepository(name: string, description?: string, isPrivate: boolean = true): Promise<GitHubRepository> {
    try {
      const { data: repo } = await this.octokit.rest.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: false,
      });
      
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        default_branch: repo.default_branch,
        private: repo.private,
        description: repo.description || undefined,
      };
    } catch (error: any) {
      console.error('Error creating repository:', error);
      throw new Error(`Failed to create repository: ${error.message}`);
    }
  }
  
  /**
   * Get all files from the project directory recursively
   */
  private async getProjectFiles(dir: string, basePath: string = ''): Promise<{ [path: string]: string }> {
    const files: { [path: string]: string } = {};
    console.log(`🔍 DEBUG: Reading directory: ${dir}`);
    
    try {
      const items = fs.readdirSync(dir);
      console.log(`🔍 DEBUG: Found ${items.length} items in ${dir}:`, items);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          console.log(`📁 DEBUG: Processing directory: ${item}`);
          // Skip node_modules, .git, and other common directories
          if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
            const subFiles = await this.getProjectFiles(fullPath, relativePath);
            Object.assign(files, subFiles);
          } else {
            console.log(`⏭️ DEBUG: Skipping directory: ${item}`);
          }
        } else {
          console.log(`📄 DEBUG: Processing file: ${item}`);
          // Read file content
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            files[relativePath] = content;
            console.log(`✅ DEBUG: Successfully read file: ${relativePath} (${content.length} chars)`);
          } catch (error) {
            console.warn(`❌ DEBUG: Could not read file ${fullPath}:`, error);
          }
        }
      }
      
      console.log(`🔍 DEBUG: Total files collected: ${Object.keys(files).length}`);
      console.log(`🔍 DEBUG: File paths:`, Object.keys(files));
      
      return files;
    } catch (error) {
      console.error(`❌ DEBUG: Error reading directory ${dir}:`, error);
      return files;
    }
  }
  
  /**
   * Get all files from database storage
   */
  private async getProjectFilesFromDatabase(): Promise<{ [path: string]: string }> {
    const files: { [path: string]: string } = {};
    console.log(`🔍 DEBUG: Reading files from database storage for project ${this.projectId}`);
    
    try {
      // Get all files from database storage for this project
      const dbFiles = await storage.getFilesByProjectId(this.projectId);
      console.log(`🔍 DEBUG: Found ${dbFiles.length} files in database`);
      
      for (const dbFile of dbFiles) {
        files[dbFile.path] = dbFile.content;
        console.log(`✅ DEBUG: Successfully read from database: ${dbFile.path} (${dbFile.content.length} chars)`);
      }
      
      console.log(`🔍 DEBUG: Total files from database: ${Object.keys(files).length}`);
      console.log(`🔍 DEBUG: Database file paths:`, Object.keys(files));
      
      return files;
    } catch (error) {
      console.error(`❌ DEBUG: Error reading files from database:`, error);
      return files;
    }
  }
  
  /**
   * Push files to a repository
   */
  async pushToRepository(owner: string, repo: string, commitMessage: string = 'Deploy from Weblisite IDE'): Promise<{ repositoryUrl: string; commitUrl: string }> {
    try {
      console.log(`🚀 Starting push to ${owner}/${repo}...`);

      // Get current files from database storage
      const files = await this.getProjectFilesFromDatabase();
      
      if (Object.keys(files).length === 0) {
        throw new Error('No files found to push. Please generate code first.');
      }

      console.log(`📁 Found ${Object.keys(files).length} files to push`);
      
      // Check if repository is empty by trying to get the default branch
      let parentSha: string | null = null;
      let isEmptyRepo = true;
      
      try {
        const { data: ref } = await this.octokit.rest.git.getRef({
          owner,
          repo,
          ref: 'heads/main'
        });
        parentSha = ref.object.sha;
        isEmptyRepo = false;
        console.log(`📋 Repository has existing commits, parent SHA: ${parentSha}`);
      } catch (error: any) {
        if (error.status === 409 || error.status === 404) {
          console.log('📋 Repository is empty, creating initial commit');
          isEmptyRepo = true;
        } else {
          throw error;
        }
      }

      if (isEmptyRepo) {
        // For empty repositories, create all files in a single commit
        return await this.createInitialCommit(owner, repo, files, commitMessage);
      } else {
        // For existing repositories, update files normally
        return await this.updateExistingRepository(owner, repo, files, commitMessage, parentSha!);
      }

    } catch (error: any) {
      console.error('Error pushing to repository:', error);
      throw new Error(`Failed to push to repository: ${error.message}`);
    }
  }

  /**
   * Create initial commit for empty repository
   */
  private async createInitialCommit(
    owner: string, 
    repo: string, 
    files: Record<string, string>, 
    commitMessage: string
  ): Promise<{ repositoryUrl: string; commitUrl: string }> {
    console.log('🎯 Creating initial commit for empty repository...');

    // Create blobs for all files
    const blobs: Array<{ path: string; sha: string; mode: string }> = [];
    
    for (const [filePath, content] of Object.entries(files)) {
      console.log(`📝 Creating blob for ${filePath}`);
      
      const { data: blob } = await this.octokit.rest.git.createBlob({
        owner,
        repo,
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64'
      });
      
      blobs.push({
        path: filePath,
        sha: blob.sha,
        mode: '100644'
      });
    }

    // Create tree with all files
    console.log(`🌳 Creating tree with ${blobs.length} files...`);
    const { data: tree } = await this.octokit.rest.git.createTree({
      owner,
      repo,
      tree: blobs.map(blob => ({
        path: blob.path,
        mode: blob.mode as any,
        type: 'blob' as const,
        sha: blob.sha
      }))
    });

    // Create commit
    console.log('💾 Creating initial commit...');
    const { data: commit } = await this.octokit.rest.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: tree.sha,
      // No parents for initial commit
    });

    // Create or update main branch reference
    console.log('🔗 Creating main branch reference...');
    try {
      await this.octokit.rest.git.createRef({
        owner,
        repo,
        ref: 'refs/heads/main',
        sha: commit.sha
      });
    } catch (error: any) {
      // If ref already exists, update it
      if (error.status === 422) {
        await this.octokit.rest.git.updateRef({
          owner,
          repo,
          ref: 'heads/main',
          sha: commit.sha
        });
      } else {
        throw error;
      }
    }

    const repositoryUrl = `https://github.com/${owner}/${repo}`;
    const commitUrl = `${repositoryUrl}/commit/${commit.sha}`;
    
    console.log(`✅ Successfully created initial commit: ${commitUrl}`);
    
    return { repositoryUrl, commitUrl };
  }

  /**
   * Update existing repository with files
   */
  private async updateExistingRepository(
    owner: string, 
    repo: string, 
    files: Record<string, string>, 
    commitMessage: string,
    parentSha: string
  ): Promise<{ repositoryUrl: string; commitUrl: string }> {
    console.log('🔄 Updating existing repository...');

    // Create blobs for all files
    const blobs: Array<{ path: string; sha: string; mode: string }> = [];
    
    for (const [filePath, content] of Object.entries(files)) {
      console.log(`📝 Creating blob for ${filePath}`);
      
      const { data: blob } = await this.octokit.rest.git.createBlob({
        owner,
        repo,
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64'
      });
      
      blobs.push({
        path: filePath,
        sha: blob.sha,
        mode: '100644'
      });
    }

    // Create tree with all files
    console.log(`🌳 Creating tree with ${blobs.length} files...`);
    const { data: tree } = await this.octokit.rest.git.createTree({
      owner,
      repo,
      tree: blobs.map(blob => ({
        path: blob.path,
        mode: blob.mode as any,
        type: 'blob' as const,
        sha: blob.sha
      }))
    });

    // Create commit with parent
    console.log('💾 Creating commit...');
    const { data: commit } = await this.octokit.rest.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: tree.sha,
      parents: [parentSha]
    });

    // Update main branch reference
    console.log('🔗 Updating main branch reference...');
    await this.octokit.rest.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: commit.sha
    });

    const repositoryUrl = `https://github.com/${owner}/${repo}`;
    const commitUrl = `${repositoryUrl}/commit/${commit.sha}`;
    
    console.log(`✅ Successfully updated repository: ${commitUrl}`);
    
    return { repositoryUrl, commitUrl };
  }
  
  /**
   * Create repository and push code
   */
  async createAndPushRepository(
    name: string,
    description?: string,
    isPrivate: boolean = true,
    commitMessage: string = 'Initial commit from Weblisite IDE'
  ): Promise<GitHubPushResult> {
    try {
      // Create the repository
      const repo = await this.createRepository(name, description, isPrivate);
      
      // Get the owner from the full_name
      const [owner] = repo.full_name.split('/');
      
      // Push the code
      const result = await this.pushToRepository(owner, repo.name, commitMessage);
      
      return result;
    } catch (error: any) {
      console.error('Error creating and pushing repository:', error);
      throw new Error(`Failed to create and push repository: ${error.message}`);
    }
  }
}

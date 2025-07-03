export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  private: boolean;
  description?: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email?: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubCommit {
  sha: string;
  html_url: string;
  message: string;
}

export interface GitHubValidation {
  valid: boolean;
  user: GitHubUser;
  scopes: string[];
  hasRepoAccess: boolean;
}

export interface GitHubPushResult {
  repositoryUrl: string;
  commitUrl: string;
  success: boolean;
}

export class GitHubService {
  private accessToken: string | null = null;

  constructor() {
    // Try to get token from localStorage on initialization
    this.accessToken = localStorage.getItem('github_access_token');
  }

  /**
   * Set the GitHub access token
   */
  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('github_access_token', token);
  }

  /**
   * Check if we have an access token
   */
  hasAccessToken(): boolean {
    return !!this.accessToken;
  }

  /**
   * Clear the access token
   */
  clearAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('github_access_token');
  }

  /**
   * Validate the GitHub token and get user info
   */
  async validateToken(): Promise<GitHubValidation> {
    if (!this.accessToken) {
      throw new Error('No GitHub access token available');
    }

    const response = await fetch('/api/github/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken: this.accessToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate GitHub token');
    }

    return response.json();
  }

  /**
   * Get user's repositories
   */
  async getRepositories(): Promise<GitHubRepository[]> {
    if (!this.accessToken) {
      throw new Error('No GitHub access token available');
    }

    const response = await fetch('/api/github/repositories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken: this.accessToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch repositories');
    }

    const data = await response.json();
    return data.repositories;
  }

  /**
   * Create a new repository and push code to it
   */
  async createAndPushRepository(
    name: string,
    description?: string,
    isPrivate: boolean = true,
    commitMessage: string = 'Initial commit from Weblisite IDE'
  ): Promise<GitHubPushResult> {
    if (!this.accessToken) {
      throw new Error('No GitHub access token available');
    }

    const response = await fetch('/api/github/create-and-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: this.accessToken,
        name,
        description,
        private: isPrivate,
        commitMessage,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create repository and push code');
    }

    return response.json();
  }

  /**
   * Push code to an existing repository
   */
  async pushToRepository(
    owner: string,
    repo: string,
    commitMessage: string = 'Deploy from Weblisite IDE'
  ): Promise<GitHubPushResult> {
    if (!this.accessToken) {
      throw new Error('No GitHub access token available');
    }

    const response = await fetch('/api/github/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: this.accessToken,
        owner,
        repo,
        commitMessage,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to push code to repository');
    }

    return response.json();
  }

  /**
   * Generate a repository name from a project prompt
   */
  generateRepositoryName(prompt: string): string {
    // Extract keywords and create a repository name
    const words = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 3);
    
    if (words.length === 0) {
      return `weblisite-project-${Date.now()}`;
    }
    
    return words.join('-').substring(0, 50);
  }

  /**
   * Generate a repository description from a project prompt
   */
  generateRepositoryDescription(prompt: string): string {
    const maxLength = 100;
    const cleaned = prompt.replace(/\s+/g, ' ').trim();
    
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    
    return cleaned.substring(0, maxLength - 3) + '...';
  }
}

// Export a singleton instance
export const githubService = new GitHubService();

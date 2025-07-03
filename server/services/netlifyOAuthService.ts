interface NetlifyOAuthUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  site_count: number;
}

interface NetlifyOAuthValidation {
  valid: boolean;
  user: NetlifyOAuthUser;
}

interface NetlifyTokenResponse {
  access_token: string;
  token_type: string;
  scope?: string;
}

interface NetlifyPersonalAccessToken {
  id: string;
  access_token: string;
  name: string;
  expires_at?: string;
}

export class NetlifyOAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.NETLIFY_OAUTH_CLIENT_ID || '';
    this.clientSecret = process.env.NETLIFY_OAUTH_CLIENT_SECRET || '';
    this.redirectUri = process.env.NETLIFY_OAUTH_REDIRECT_URI || 'http://localhost:5000/api/netlify/oauth/callback';
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('Netlify OAuth credentials not configured. OAuth flow will not work.');
    }
  }

  /**
   * Get the OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state: state,
      scope: 'read write' // Request read and write permissions
    });

    return `https://app.netlify.com/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<NetlifyTokenResponse> {
    try {
      const response = await fetch('https://api.netlify.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Netlify token exchange error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to exchange code for token: ${response.status} ${response.statusText}`);
      }

      const tokenData = await response.json();
      return tokenData;
    } catch (error: any) {
      console.error('Error exchanging code for token:', error);
      throw new Error(`Token exchange failed: ${error.message}`);
    }
  }

  /**
   * Validate access token and get user info
   */
  async validateToken(accessToken: string): Promise<NetlifyOAuthValidation> {
    try {
      const response = await fetch('https://api.netlify.com/api/v1/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Invalid token: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();
      
      return {
        valid: true,
        user: {
          id: userData.id,
          name: userData.full_name || userData.name || userData.email,
          email: userData.email,
          avatar_url: userData.avatar_url,
          site_count: userData.site_count || 0,
        },
      };
    } catch (error: any) {
      console.error('Netlify token validation error:', error);
      throw new Error(`Invalid Netlify token: ${error.message}`);
    }
  }

  /**
   * Create a Personal Access Token (PAT) for long-term API access
   */
  async createPersonalAccessToken(
    accessToken: string, 
    name: string = 'Weblisite Deployment Token',
    expiresInDays: number = 30
  ): Promise<NetlifyPersonalAccessToken> {
    try {
      const expiresIn = expiresInDays * 24 * 60 * 60; // Convert days to seconds

      const response = await fetch('https://api.netlify.com/api/v1/oauth/applications/create_token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          administrator_id: null,
          expires_in: expiresIn,
          grant_saml: false,
          name: name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create PAT:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to create Personal Access Token: ${response.status} ${response.statusText}`);
      }

      const patData = await response.json();
      return patData;
    } catch (error: any) {
      console.error('Error creating Personal Access Token:', error);
      throw new Error(`PAT creation failed: ${error.message}`);
    }
  }

  /**
   * Check if OAuth is configured
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
} 
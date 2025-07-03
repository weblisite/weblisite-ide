# Netlify OAuth Setup Guide

This guide will help you set up Netlify OAuth integration for deploying websites to users' Netlify accounts.

## 1. Create a Netlify OAuth Application

1. Go to [Netlify Applications](https://app.netlify.com/applications)
2. Click "New OAuth app"
3. Fill in the application details:
   - **Application name**: `Weblisite Deploy`
   - **Description**: `Deploy websites from Weblisite to Netlify`
   - **Redirect URI**: `http://localhost:5000/api/netlify/oauth/callback` (for development)
   - For production, use: `https://yourdomain.com/api/netlify/oauth/callback`

4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

## 2. Configure Environment Variables

Add these environment variables to your `.env` file:

```bash
# Netlify OAuth Configuration
NETLIFY_OAUTH_CLIENT_ID=your_client_id_here
NETLIFY_OAUTH_CLIENT_SECRET=your_client_secret_here
NETLIFY_OAUTH_REDIRECT_URI=http://localhost:5000/api/netlify/oauth/callback
```

### For Production:
```bash
NETLIFY_OAUTH_REDIRECT_URI=https://yourdomain.com/api/netlify/oauth/callback
```

## 3. How the OAuth Flow Works

1. **User clicks "Connect Netlify Account"** in the deployment modal
2. **Backend generates authorization URL** with state parameter for security
3. **User is redirected to Netlify** to authorize the application
4. **Netlify redirects back** to our callback URL with authorization code
5. **Backend exchanges code for access token** and creates a Personal Access Token (PAT)
6. **User can now deploy** to their own Netlify account

## 4. Deployment Flow

1. **Generate website** using AI
2. **Push to GitHub** (GitHub OAuth required)
3. **Connect Netlify account** (Netlify OAuth)
4. **Deploy from GitHub to Netlify** automatically

## 5. Features

- ✅ **OAuth 2.0 Authentication** with Netlify
- ✅ **Personal Access Token** creation for long-term access
- ✅ **Deploy to user's own account** 
- ✅ **GitHub integration** for source code
- ✅ **Automatic builds** and deployments
- ✅ **Custom domains** and SSL support
- ✅ **Continuous deployment** on GitHub pushes

## 6. Security

- Uses CSRF protection with state parameters
- Stores tokens securely in localStorage
- Validates tokens on each request
- Creates time-limited Personal Access Tokens
- Only requests necessary scopes (`read write`)

## 7. Error Handling

- Graceful fallback to manual deployment instructions
- Clear error messages for users
- Automatic retry mechanisms
- Token validation and refresh

## 8. Testing

1. Start the development server: `npm run dev`
2. Go to `/builder` route
3. Generate a simple website
4. Click "Deploy" → "Push to GitHub" → Connect GitHub
5. After pushing, click "Deploy" → "Connect Netlify Account"
6. Complete OAuth flow and deploy!

---

🎉 **Your GitHub → Netlify deployment flow is now ready!**

Users can now deploy their generated websites directly to their own Netlify accounts with full GitHub integration. 
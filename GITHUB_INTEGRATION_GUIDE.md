# GitHub Integration Guide

## Overview
The Weblisite IDE now supports pushing your generated code directly to GitHub repositories! This feature allows users to:

- Connect their GitHub account via OAuth
- Create new repositories or push to existing ones
- Maintain proper version control of their generated projects
- Share and collaborate on their projects

## Features

### 🔐 GitHub OAuth Authentication
- Secure authentication through Supabase GitHub OAuth
- Enhanced permissions for repository access
- Automatic token management and validation

### 📁 Repository Management
- **Create New Repository**: Create a new public or private repository
- **Push to Existing**: Select from your existing repositories
- **Smart Naming**: Auto-generate repository names from project prompts
- **Custom Commit Messages**: Personalize your commit messages

### 🚀 Code Deployment Options
1. **GitHub Push (FREE)** - Save your code to GitHub repositories
2. **Production Deployment ($5.00)** - Deploy to live hosting with custom domains

## How to Use

### 1. Generate Your Project
- Use the AI chat to generate your desired application
- Wait for the code generation to complete

### 2. Access Deployment Options
- Click the "Deploy Project" button
- Choose between GitHub push or production deployment

### 3. Connect to GitHub
- Click "Push to GitHub (Free)"
- Authenticate with your GitHub account
- Grant repository permissions when prompted

### 4. Choose Repository Option
**Create New Repository:**
- Enter repository name (auto-suggested from your prompt)
- Add optional description
- Choose public or private visibility
- Set custom commit message

**Use Existing Repository:**
- Select from your available repositories
- Set custom commit message
- Push your code

### 5. Success!
- View your repository on GitHub
- See the commit with your generated code
- Share your project URL with others

## Technical Implementation

### Architecture
```
Frontend (React) → GitHub Service → Backend API → GitHub API
                                  ↓
                               Project Files → Git Operations
```

### Key Components

#### Frontend
- `GitHubModal.tsx`: Main UI for GitHub integration
- `GitHubService.ts`: Client-side GitHub operations
- `DeploymentModal.tsx`: Updated with GitHub option

#### Backend
- `githubService.ts`: Server-side GitHub API operations
- GitHub API routes: `/api/github/*`
- File management and Git operations

### Security Features
- OAuth token validation
- Secure token storage
- Permission scoping
- Error handling and validation

## API Endpoints

### GitHub Integration Routes
- `POST /api/github/validate` - Validate GitHub token
- `POST /api/github/repositories` - Get user repositories
- `POST /api/github/create-and-push` - Create repo and push code
- `POST /api/github/push` - Push to existing repository

## Benefits

### For Users
- **Free version control** for all generated projects
- **Professional workflow** with Git history
- **Easy sharing** via GitHub URLs
- **Collaboration ready** with proper repository structure

### For Developers
- **Open source friendly** - easy to contribute back
- **Portfolio building** - showcase generated projects
- **Learning opportunity** - see generated code structure
- **Iteration support** - modify and improve projects

## Future Enhancements

- [ ] GitHub Actions integration for CI/CD
- [ ] Automatic README generation
- [ ] Issue and PR templates
- [ ] Branch management
- [ ] Collaborative features
- [ ] GitHub Pages deployment
- [ ] Repository analytics

## Troubleshooting

### Common Issues

**Authentication Failed**
- Ensure you've granted repository permissions
- Check if your GitHub token is valid
- Try reconnecting your GitHub account

**Push Failed**
- Verify repository exists and you have write access
- Check if repository is not archived or read-only
- Ensure there are no conflicts with existing files

**No Repositories Found**
- Click "Refresh" to reload your repositories
- Ensure you have repositories in your GitHub account
- Check if you've granted the correct permissions

### Getting Help
- Check the browser console for detailed error messages
- Ensure your GitHub account has necessary permissions
- Contact support if issues persist

## Security Considerations

- Tokens are stored securely and validated on each request
- Only granted scopes are accessible
- No sensitive data is logged or transmitted
- OAuth follows GitHub security best practices

---

🎉 **Happy Coding with GitHub Integration!**

Your generated projects now have a permanent home on GitHub, making them accessible, shareable, and ready for collaboration!

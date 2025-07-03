# Supabase Setup Guide for Weblisite

This guide will help you set up Supabase for your Weblisite IDE application, providing authentication, database, and file storage capabilities.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. A new Supabase project created

## Environment Variables Setup

### Client-Side Variables (React App)
Add these to your `.env` file with `VITE_` prefix for browser access:

```env
# Supabase Configuration (Client-side)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Server-Side Variables (Node.js Server)
Add these to your `.env` file for server-side Supabase operations:

```env
# Supabase Configuration (Server-side) 
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Enable Supabase Storage (set to 'true' to use Supabase instead of MemStorage)
USE_SUPABASE=true
```

### Other Required Environment Variables
```env
# AI Service
ANTHROPIC_API_KEY=your-anthropic-api-key

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key

# Deployment Service
NETLIFY_AUTH_TOKEN=your-netlify-personal-access-token

# Server Configuration
NODE_ENV=production # or development
PORT=5000
```

## Database Schema Setup

1. **Navigate to your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the entire contents of `supabase-schema.sql`**
4. **Execute the script**

This will create:
- `user_profiles` - User authentication and profile data
- `projects` - User projects and workspace data  
- `project_files` - AI-generated files and user code
- `project_deployments` - Deployment history and status
- `project_configs` - Project configuration storage (Supabase configs, etc.)
- Storage buckets for file uploads
- Row Level Security (RLS) policies
- Indexes for performance

## Storage Architecture

### Development Mode (Default)
```
Client ↔ Supabase (auth, profiles, saved projects)
Server ↔ MemStorage (temporary AI generation workspace)
```

### Production Mode (Persistent)
```
Client ↔ Supabase (auth, profiles, projects)  
Server ↔ Supabase (persistent AI generation workspace)
```

**To enable production mode:** Set `USE_SUPABASE=true` in your environment variables.

## OAuth Provider Setup (Optional)

### Google OAuth
1. Go to Project Settings → Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Secret
4. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### GitHub OAuth  
1. Enable GitHub provider in Supabase
2. Add your GitHub App credentials
3. Configure redirect URL

## Key Features

### Authentication System
- Email/password authentication
- Social login (Google, GitHub)
- User profiles with plan management (Free/Pro/Team)
- Stripe integration for payments

### Project Management
- Create/read/update/delete projects
- File management with version control
- Real-time collaboration capabilities
- Deployment tracking

### AI Code Generation
- **Development**: Files stored in memory (faster, temporary)
- **Production**: Files stored in Supabase (persistent, scalable)
- Syntax validation and error checking
- File auto-save and recovery

### File Storage
- Project assets and user uploads
- Secure file access with RLS
- CDN-optimized delivery

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Project files protected by ownership
- Secure file upload/download

### API Security
- Service role key for server operations
- Anon key for client operations
- JWT-based authentication

## Performance Optimizations

### Database Indexes
- Optimized queries for project listing
- Fast file path lookups
- Efficient deployment history

### Caching Strategy
- Client-side query caching with React Query
- Server-side connection pooling
- Optimistic updates for better UX

## Deployment Considerations

### Environment Variables
- Use environment-specific Supabase projects
- Separate staging/production databases
- Secure secret management

### Scaling
- Connection pooling for high traffic
- Read replicas for analytics
- CDN for static assets

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check policy conditions match your use case
   - Verify user ID mapping

2. **Connection Issues**
   - Verify environment variables are set
   - Check network connectivity
   - Validate API keys

3. **Storage Access Denied**
   - Confirm bucket policies
   - Check file path permissions
   - Verify authentication state

### Development Tips

1. **Use MemStorage for Development**
   ```bash
   # Don't set USE_SUPABASE or set it to false
   USE_SUPABASE=false
   ```

2. **Enable Supabase for Production**
   ```bash
   USE_SUPABASE=true
   NODE_ENV=production
   ```

3. **Test Both Storage Methods**
   - Develop with MemStorage (faster iteration)
   - Test with Supabase (production behavior)

## Next Steps

1. **Set up environment variables**
2. **Run the SQL schema script**
3. **Configure OAuth providers (optional)**
4. **Test authentication flow**
5. **Create your first project**
6. **Deploy to production with `USE_SUPABASE=true`**

## Support

For issues specific to this implementation:
- Check the console for Supabase connection errors
- Verify your environment variables
- Ensure the database schema is properly applied

For Supabase-specific issues:
- Visit the Supabase documentation: https://supabase.com/docs
- Check the Supabase dashboard for logs and metrics 
# Weblisite - Full-Stack Web Development IDE

A powerful browser-based IDE for web development with built-in AI assistance, real-time preview, and seamless deployment to GitHub and Netlify.

## 🚀 Features

### Core IDE Features
- **Code Editor**: Monaco-based editor with syntax highlighting and IntelliSense
- **File Explorer**: Full file system management with folder structure
- **Live Preview**: Real-time preview of your web applications
- **AI Chat Assistant**: Integrated AI for code generation and debugging help
- **Multi-Project Support**: Manage multiple projects simultaneously

### Development Tools
- **Syntax Validation**: Real-time code validation and error detection
- **Component Library**: Pre-built UI components using shadcn/ui
- **Responsive Design**: Mobile-first development approach
- **Hot Module Replacement**: Instant updates during development

### Deployment & Integration
- **GitHub Integration**: Push code directly to GitHub repositories
- **Netlify Deployment**: One-click deployment to Netlify with custom domains
- **OAuth Authentication**: Secure authentication with GitHub and Netlify
- **Project Templates**: Start with pre-configured project templates

### Data & Storage
- **Supabase Integration**: Built-in database and authentication
- **File Storage**: Persistent project file storage
- **User Profiles**: Customizable user preferences and settings
- **Project History**: Version control and project backups

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Monaco Editor** for code editing
- **Socket.io** for real-time communication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Socket.io** for WebSocket connections
- **Supabase** for database and authentication
- **GitHub API** for repository management
- **Netlify API** for deployment

### Services & APIs
- **Anthropic Claude** for AI assistance
- **GitHub OAuth** for version control
- **Netlify OAuth** for deployment
- **Supabase Auth** for user management

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weblisite.git
   cd weblisite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Netlify OAuth
   NETLIFY_CLIENT_ID=your_netlify_client_id
   NETLIFY_CLIENT_SECRET=your_netlify_client_secret

   # Anthropic AI
   ANTHROPIC_API_KEY=your_anthropic_api_key

   # Application Settings
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5000
   ```

4. **Database Setup**
   - Set up Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Configure authentication providers

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🔧 Configuration Guides

- **GitHub Integration**: See [GITHUB_INTEGRATION_GUIDE.md](./GITHUB_INTEGRATION_GUIDE.md)
- **Netlify OAuth Setup**: See [NETLIFY_OAUTH_SETUP.md](./NETLIFY_OAUTH_SETUP.md)
- **Supabase Configuration**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **User Preferences**: See [USER_PREFERENCES_GUIDE.md](./USER_PREFERENCES_GUIDE.md)

## 🚀 Deployment

### GitHub → Netlify Flow

1. **Connect GitHub Account**: Authenticate with your GitHub account
2. **Push to Repository**: Push your project to a GitHub repository
3. **Connect Netlify**: Authenticate with your Netlify account
4. **Deploy**: One-click deployment with automatic builds

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

## 📁 Project Structure

```
weblisite/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries and services
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
│   └── index.html          # Main HTML template
├── server/                 # Backend Node.js application
│   ├── api/                # API endpoints
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   └── index.ts            # Server entry point
├── shared/                 # Shared type definitions
├── project/                # Sample project files
└── docs/                   # Documentation files
```

## 🎯 Usage

### Creating a New Project

1. Open Weblisite in your browser
2. Click "New Project" or select a template
3. Start coding in the Monaco editor
4. See real-time preview in the preview panel
5. Use AI assistant for code generation and debugging

### Deploying Your Project

1. Ensure your project is ready for deployment
2. Click the "Deploy" button
3. Connect your GitHub account (if not already connected)
4. Push code to a GitHub repository
5. Connect your Netlify account
6. Deploy with one click

### Using AI Assistant

1. Open the AI chat panel
2. Describe what you want to build or ask for help
3. Get code suggestions and implementation guidance
4. Apply suggestions directly to your code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [shadcn/ui](https://ui.shadcn.com/) for the UI component library
- [Supabase](https://supabase.com/) for database and authentication
- [Netlify](https://netlify.com/) for hosting and deployment
- [Anthropic](https://anthropic.com/) for AI assistance

## 📞 Support

If you have any questions or need help, please:

1. Check the documentation files in the repository
2. Open an issue on GitHub
3. Contact the development team

## 🎨 Screenshots

*Add screenshots of your application here*

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**Built with ❤️ by the Weblisite Team** 
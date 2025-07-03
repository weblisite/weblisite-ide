import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { AIService } from "./services/aiService";
import { FileService } from "./services/fileService";
import { PreviewService } from "./services/previewService";
import { DeployService } from "./services/deployService";
import { GitHubService } from "./services/githubService";
import { NetlifyService } from "./services/netlifyService";
import { NetlifyOAuthService } from "./services/netlifyOAuthService";
import { 
  initializeWebSocketServer, 
  emitFileCreated, 
  emitFileContent, 
  emitFileGenerated, 
  emitGenerationComplete,
  emitPreviewReady,
  getSocketServer
} from "./utils/websocket";
import { supabaseConfigSchema } from "@shared/schema";
import path from "path";
import * as fs from "fs/promises";
import anthropicRouter from "./api/anthropic";
import archiver from "archiver";
import { createClient } from '@supabase/supabase-js';

// Mock active project ID (in a real app, this would come from auth)
const ACTIVE_PROJECT_ID = 1;

// Initialize Stripe with the STRIPE_SECRET_KEY from environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe payments will not work properly.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// Initialize Supabase client for user preferences
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient: any = null;
if (supabaseUrl && supabaseServiceKey) {
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  console.log("Supabase client initialized for user preferences");
} else {
  console.warn("Supabase credentials not found. User preferences will not be available for code generation.");
}

/**
 * Fetch user preferences for personalized code generation
 */
async function fetchUserPreferences(userId?: string): Promise<any> {
  if (!supabaseClient || !userId) {
    console.log("No Supabase client or user ID - using default preferences");
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
      .rpc('get_user_code_generation_preferences', { user_uuid: userId });
    
    if (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
    
    console.log("User preferences fetched successfully for user:", userId);
    return data;
  } catch (error) {
    console.error('Error calling user preferences function:', error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize WebSocket
  initializeWebSocketServer(httpServer);
  
  // Initialize services (Note: AIService is now created per request with user preferences)
  const fileService = new FileService(ACTIVE_PROJECT_ID);
  const previewService = new PreviewService();
  const deployService = new DeployService(ACTIVE_PROJECT_ID);
  
  // Register API routers
  app.use('/api', anthropicRouter);
  
  // API Routes
  // Generate code using AI
  app.post("/api/generate", async (req, res) => {
    const { prompt, userId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    
    // Start the generation process - respond immediately
    res.status(200).json({ message: 'Generation started' });
    
    // Use a separate try/catch after the response is sent
    // to handle errors without trying to send another response
    
    // Create a flag and timeout to prevent hanging indefinitely
    let isProcessing = true;
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        isProcessing = false;
        console.error('Code generation timed out after 3 minutes');
        
        // Notify client via WebSocket
        const io = getSocketServer();
        if (io) {
          io.emit('generation-error', { 
            message: 'Generation timed out. Try a simpler prompt or break your request into smaller pieces.' 
          });
          emitGenerationComplete();
        }
      }
    }, 180000); // 3 minute timeout
    
    try {
      // Fetch user preferences for personalized code generation
      let userPreferences = null;
      if (userId) {
        console.log(`Fetching preferences for user: ${userId}`);
        userPreferences = await fetchUserPreferences(userId);
        if (userPreferences) {
          console.log("User preferences loaded for code generation");
        }
      } else {
        console.log("No user ID provided, using default preferences");
      }
      
      // Initialize AI service with user preferences
      const aiService = new AIService(ACTIVE_PROJECT_ID, userPreferences);
      
      // Process files sequentially with typewriter effect
      const files = await aiService.generateCode(prompt);
      
      // Check if we're still processing (not timed out)
      if (!isProcessing) return;
      
      clearTimeout(timeoutId);
      isProcessing = false;
      
      // Skip the typewriter effect - we're already streaming files in real-time
      // This is just a final pass to ensure all files were properly created
      
      // This code now handles these edge cases:
      // 1. Files that were streamed but might not be complete
      // 2. Files that might have been missed due to parsing issues
      for (const file of files) {
        // Make sure all files are saved properly to both the filesystem and storage
        try {
          // Save the file (this is now redundant for most files since we stream-create and save them)
          // but ensures that all files are properly saved to both the filesystem and storage
          await fileService.createOrUpdateFile(file.path, file.content);
          console.log(`Final pass: Ensured ${file.path} is properly saved`);
        } catch (error) {
          console.error(`Error ensuring file ${file.path} exists:`, error);
        }
        
        // Short delay between files
        await new Promise(resolve => setTimeout(resolve, 300)); // Reduced delay for better performance
      }
      
      // Make one final pass to get all files from the file system and ensure they're saved in storage
      try {
        // Get all files in the temp directory
        const tempDirPath = path.join(process.cwd(), 'temp');
        const allFilesInProject = await getAllFilesRecursively(tempDirPath);
        
        console.log(`Final autosave: Found ${allFilesInProject.length} files in project directory`);
        
        // Ensure all files are saved in storage
        for (const filePath of allFilesInProject) {
          try {
            // Read the file
            const fullPath = path.join(tempDirPath, filePath);
            const content = await fs.readFile(fullPath, 'utf8');
            
            // Save to storage
            await fileService.createOrUpdateFile(filePath, content);
            console.log(`Final autosave: Saved ${filePath} to storage`);
          } catch (fileError) {
            console.error(`Error ensuring file ${filePath} is saved:`, fileError);
          }
        }
        
        console.log("Project auto-save complete - all files are now saved and will persist across page refreshes");
      } catch (autoSaveError) {
        console.error('Error during final project auto-save:', autoSaveError);
      }
        
      // Emit generation complete event
      emitGenerationComplete();
      
      // Update preview
      await previewService.executeProject();
      emitPreviewReady('ready');
    } catch (error: any) {
      // Check if we're still processing (not timed out)
      if (!isProcessing) return;
      
      clearTimeout(timeoutId);
      isProcessing = false;
      
      // Log the error since we can't send another response
      console.error('Error generating code:', error);
      
      // Notify the client about the error via websocket
      const io = getSocketServer();
      if (io) {
        io.emit('generation-error', { 
          message: `Error during generation: ${error.message || 'Unknown error'}. Please try again.` 
        });
        emitGenerationComplete();
      }
    }
  });
  
  // Get all files
  app.get("/api/files", async (req, res) => {
    try {
      const files = await fileService.getFiles();
      res.status(200).json(files);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get a single file
  app.get("/api/file", async (req, res) => {
    try {
      const { path } = req.query;
      
      if (!path || typeof path !== 'string') {
        return res.status(400).json({ message: 'File path is required' });
      }
      
      const content = await fileService.getFileContent(path);
      res.status(200).json({ content });
    } catch (error: any) {
      console.error('Error fetching file:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update a file
  app.post("/api/update-file", async (req, res) => {
    try {
      const { path, content } = req.body;
      
      if (!path || !content) {
        return res.status(400).json({ message: 'Path and content are required' });
      }
      
      await fileService.createOrUpdateFile(path, content);
      res.status(200).json({ message: 'File updated successfully' });
      
      // Update preview
      await previewService.executeProject();
      emitPreviewReady('ready');
    } catch (error: any) {
      console.error('Error updating file:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Execute project for preview
  app.post("/api/execute", async (req, res) => {
    try {
      const status = await previewService.executeProject();
      
      res.status(200).json({ status: 'ready' });
      
      // Emit preview ready event (no URL needed now)
      emitPreviewReady('ready');
    } catch (error: any) {
      console.error('Error executing project:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get preview content for inline display
  app.get("/api/preview", async (req, res) => {
    try {
      const content = await previewService.getPreviewContent();
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(content);
    } catch (error: any) {
      console.error('Error getting preview content:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Save all project files
  app.post("/api/save-all-files", async (req, res) => {
    try {
      // Get all files in the project directory
      const tempDirPath = path.join(process.cwd(), 'temp');
      const allFilesInProject = await getAllFilesRecursively(tempDirPath);
      
      console.log(`Save All Files: Found ${allFilesInProject.length} files in project directory`);
      
      let savedCount = 0;
      
      // Ensure all files are saved in storage
      for (const filePath of allFilesInProject) {
        try {
          // Read the file
          const fullPath = path.join(tempDirPath, filePath);
          const content = await fs.readFile(fullPath, 'utf8');
          
          // Save to storage
          await fileService.createOrUpdateFile(filePath, content);
          savedCount++;
        } catch (fileError) {
          console.error(`Error saving file ${filePath}:`, fileError);
        }
      }
      
      console.log(`Save All Files: Successfully saved ${savedCount} files`);
      res.status(200).json({ message: `Successfully saved ${savedCount} files` });
    } catch (error: any) {
      console.error('Error saving all files:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Download project as zip
  app.get("/api/download-project", async (req, res) => {
    try {
      console.log('Project download requested');
      
      // Get all files in the project directory
      const tempDirPath = path.join(process.cwd(), 'temp');
      const allFilesInProject = await getAllFilesRecursively(tempDirPath);
      
      if (allFilesInProject.length === 0) {
        return res.status(404).json({ message: 'No files found in project' });
      }
      
      console.log(`Downloading ${allFilesInProject.length} files`);
      
      // Set response headers for file download
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `project-${timestamp}.zip`;
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Create archiver instance
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });
      
      // Handle archiver errors
      archive.on('error', (err: any) => {
        console.error('Archive error:', err);
        res.status(500).json({ message: 'Error creating zip file' });
      });
      
      // Pipe archive data to response
      archive.pipe(res);
      
      // Add files to archive
      for (const filePath of allFilesInProject) {
        try {
          const fullPath = path.join(tempDirPath, filePath);
          const stats = await fs.stat(fullPath);
          
          if (stats.isFile()) {
            const fileContent = await fs.readFile(fullPath);
            archive.append(fileContent, { name: filePath });
            console.log(`Added to archive: ${filePath}`);
          }
        } catch (fileError) {
          console.error(`Error adding file ${filePath} to archive:`, fileError);
          // Continue with other files even if one fails
        }
      }
      
      // Finalize the archive
      await archive.finalize();
      
      console.log(`Project download complete: ${filename}`);
    } catch (error: any) {
      console.error('Error downloading project:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: error.message });
      }
    }
  });
  
  // Save Supabase config
  app.post("/api/supabase-config", async (req, res) => {
    try {
      const result = supabaseConfigSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid Supabase configuration' });
      }
      
      await storage.saveSupabaseConfig(ACTIVE_PROJECT_ID, result.data);
      res.status(200).json({ message: 'Supabase configuration saved successfully' });
    } catch (error: any) {
      console.error('Error saving Supabase config:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Fix errors in generated code
  app.post("/api/fix-error", async (req, res) => {
    const { errorMessage, userId } = req.body;
    
    if (!errorMessage) {
      return res.status(400).json({ message: 'Error message is required' });
    }
    
    // Start error fixing process - respond immediately
    res.status(200).json({ message: 'Error fixing started' });
    
    // Create a flag and timeout to prevent hanging indefinitely
    let isProcessing = true;
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        isProcessing = false;
        console.error('Error fixing timed out after 2 minutes');
        
        // Notify client via WebSocket
        const io = getSocketServer();
        if (io) {
          io.emit('generation-error', { 
            message: 'Error fixing timed out. The issue might be too complex to resolve automatically.' 
          });
          emitGenerationComplete();
        }
      }
    }, 120000); // 2 minute timeout
    
    try {
      console.log(`Starting error fixing for: ${errorMessage.substring(0, 150)}...`);
      
      // Fetch user preferences for personalized error fixing
      let userPreferences = null;
      if (userId) {
        console.log(`Fetching preferences for error fixing: ${userId}`);
        userPreferences = await fetchUserPreferences(userId);
      }
      
      // Initialize AI service with user preferences
      const aiService = new AIService(ACTIVE_PROJECT_ID, userPreferences);
      
      // Process the error fixing
      const fixedFiles = await aiService.fixError(errorMessage);
      
      // Check if we're still processing (not timed out)
      if (!isProcessing) return;
      
      clearTimeout(timeoutId);
      isProcessing = false;
      
      // Create a message summarizing what was fixed
      let fixMessage = '';
      if (fixedFiles.length === 0) {
        fixMessage = "I analyzed the error but couldn't identify a specific solution. Please provide more details about the error.";
      } else {
        fixMessage = `✅ I've fixed the error by updating ${fixedFiles.length} file(s): ${fixedFiles.map((file: any) => file.path).join(', ')}`;
      }
      
      // Apply the fixes in real-time with the typewriter effect
      for (const file of fixedFiles) {
        try {
          // Emit file created or selected event
          emitFileCreated({ 
            path: file.path, 
            name: file.path.split('/').pop() || file.path 
          });
          
          // Process line by line for a better typewriter effect
          const lines = file.content.split('\n');
          for (const line of lines) {
            emitFileContent(file.path, line + '\n');
            // Small delay between lines
            await new Promise(resolve => setTimeout(resolve, 5));
          }
          
          // Actually create/update the file
          const fullPath = path.join(process.cwd(), 'temp', file.path);
          const dirPath = path.dirname(fullPath);
          
          // Ensure directory exists
          await fs.mkdir(dirPath, { recursive: true });
          
          // Write the file
          await fs.writeFile(fullPath, file.content);
          console.log(`Applied fix to file: ${file.path}`);
          
          // Save to storage
          await fileService.createOrUpdateFile(file.path, file.content);
          
          // Emit file generated event
          emitFileGenerated(file.path);
          
          // Small delay between files
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error applying fix to ${file.path}:`, error);
        }
      }
      
      // Add a message to indicate what was fixed
      const io = getSocketServer();
      if (io) {
        io.emit('assistant-message', { 
          content: fixMessage 
        });
      }
      
      // Complete the operation
      emitGenerationComplete();
      
      // Update preview to check if the error is fixed
      await previewService.executeProject();
      emitPreviewReady('ready');
      
    } catch (error: any) {
      // Check if we're still processing (not timed out)
      if (!isProcessing) return;
      
      clearTimeout(timeoutId);
      isProcessing = false;
      
      console.error('Error during error fixing:', error);
      
      // Notify client via WebSocket
      const io = getSocketServer();
      if (io) {
        io.emit('generation-error', { 
          message: error.message || 'Unknown error occurred during error fixing'
        });
        emitGenerationComplete();
      }
    }
  });
  
  // Create payment intent for Stripe checkout
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount = 5.00 } = req.body; // Default to $5.00 if not specified
      
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ 
          message: 'Stripe secret key is not configured. Please contact the administrator.' 
        });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          projectId: ACTIVE_PROJECT_ID.toString()
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // =======================
  // GITHUB INTEGRATION ROUTES
  // =======================
  
  // Get GitHub user info and validate token
  app.post("/api/github/validate", async (req, res) => {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: 'GitHub access token is required' });
      }
      
      const githubService = new GitHubService(ACTIVE_PROJECT_ID, accessToken);
      const validation = await githubService.validateToken();
      
      if (!validation.valid) {
        return res.status(401).json({ message: 'Invalid GitHub access token' });
      }
      
      res.status(200).json({
        valid: true,
        user: validation.user,
        scopes: validation.scopes,
        hasRepoAccess: validation.hasRepoAccess
      });
    } catch (error: any) {
      console.error('Error validating GitHub token:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get user's GitHub repositories
  app.post("/api/github/repositories", async (req, res) => {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: 'GitHub access token is required' });
      }
      
      const githubService = new GitHubService(ACTIVE_PROJECT_ID, accessToken);
      const repositories = await githubService.getRepositories();
      
      res.status(200).json({ repositories });
    } catch (error: any) {
      console.error('Error fetching GitHub repositories:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create a new GitHub repository
  app.post("/api/github/create-repository", async (req, res) => {
    try {
      const { accessToken, name, description, isPrivate } = req.body;
      
      if (!accessToken || !name) {
        return res.status(400).json({ message: 'GitHub access token and repository name are required' });
      }
      
      const githubService = new GitHubService(ACTIVE_PROJECT_ID, accessToken);
      const repository = await githubService.createRepository(name, description, isPrivate);
      
      res.status(200).json({ repository });
    } catch (error: any) {
      console.error('Error creating GitHub repository:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Push project to GitHub repository
  app.post("/api/github/push", async (req, res) => {
    try {
      const { accessToken, owner, repo, commitMessage } = req.body;
      
      if (!accessToken || !owner || !repo) {
        return res.status(400).json({ 
          message: 'GitHub access token, repository owner, and repository name are required' 
        });
      }
      
      const githubService = new GitHubService(ACTIVE_PROJECT_ID, accessToken);
      const pushResult = await githubService.pushToRepository(
        owner, 
        repo, 
        commitMessage || 'Deploy from Weblisite IDE'
      );
      
      res.status(200).json({ 
        success: true,
        repositoryUrl: pushResult.repositoryUrl,
        commitUrl: pushResult.commitUrl
      });
    } catch (error: any) {
      console.error('Error pushing to GitHub:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Combined GitHub create and push (for new repositories)
  app.post("/api/github/create-and-push", async (req, res) => {
    try {
      const { 
        accessToken, 
        name, 
        description, 
        isPrivate, 
        commitMessage 
      } = req.body;
      
      if (!accessToken || !name) {
        return res.status(400).json({ 
          message: 'GitHub access token and repository name are required' 
        });
      }
      
      const githubService = new GitHubService(ACTIVE_PROJECT_ID, accessToken);
      
      // First, create the repository
      const repository = await githubService.createRepository(name, description, isPrivate);
      
      // Wait a moment for GitHub to fully initialize the repository
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Then push the project files
      const pushResult = await githubService.pushToRepository(
        repository.full_name.split('/')[0], // owner
        repository.name, // repo name
        commitMessage || 'Initial commit from Weblisite IDE'
      );
      
      res.status(200).json({ 
        success: true,
        repositoryUrl: pushResult.repositoryUrl,
        commitUrl: pushResult.commitUrl
      });
    } catch (error: any) {
      console.error('Error creating repository and pushing:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ==============================================
  // NETLIFY DEPLOYMENT ROUTES
  // ==============================================
  
  // Validate Netlify token and get user info
  app.post("/api/netlify/validate", async (req, res) => {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: 'Netlify access token is required' });
      }
      
      const netlifyService = new NetlifyService(accessToken);
      const validation = await netlifyService.validateToken();
      
      res.status(200).json({
        valid: validation.valid,
        user: validation.user,
        scopes: validation.scopes
      });
    } catch (error: any) {
      console.error('Error validating Netlify token:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get user's Netlify sites
  app.post("/api/netlify/sites", async (req, res) => {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: 'Netlify access token is required' });
      }
      
      const netlifyService = new NetlifyService(accessToken);
      const sites = await netlifyService.getSites();
      
      res.status(200).json({ sites });
    } catch (error: any) {
      console.error('Error fetching Netlify sites:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Deploy from GitHub repository to Netlify
  app.post("/api/netlify/deploy-from-github", async (req, res) => {
    try {
      const { 
        netlifyAccessToken, 
        githubRepoUrl, 
        siteName, 
        buildCommand = 'npm run build',
        publishDirectory = 'dist',
        branch = 'main'
      } = req.body;
      
      if (!githubRepoUrl) {
        return res.status(400).json({ 
          message: 'GitHub repository URL is required' 
        });
      }
      
      // Create Netlify service (can work with or without token)
      const netlifyService = new NetlifyService(netlifyAccessToken);
      
      // Create Netlify site from GitHub repository (returns either site or instructions)
      const result = await netlifyService.createSiteFromGitHub(
        githubRepoUrl,
        siteName,
        buildCommand,
        publishDirectory,
        branch
      );
      
      // Check if result is manual instructions or actual site
      if ('manual' in result) {
        // Return manual deployment instructions
        res.status(200).json({ 
          success: true,
          manual: true,
          instructions: result.instructions,
          netlifyToml: result.netlifyToml,
          connectUrl: result.connectUrl
        });
      } else {
        // Return actual deployed site
        res.status(200).json({ 
          success: true,
          manual: false,
          site: {
            id: result.id,
            name: result.name,
            url: result.url,
            adminUrl: result.admin_url,
            repoUrl: result.repo_url,
            repoBranch: result.repo_branch
          }
        });
      }
    } catch (error: any) {
      console.error('Error deploying from GitHub to Netlify:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Trigger a new deployment for an existing Netlify site
  app.post("/api/netlify/trigger-deploy", async (req, res) => {
    try {
      const { accessToken, siteId } = req.body;
      
      if (!accessToken || !siteId) {
        return res.status(400).json({ 
          message: 'Netlify access token and site ID are required' 
        });
      }
      
      const netlifyService = new NetlifyService(accessToken);
      const deployment = await netlifyService.triggerDeploy(siteId);
      
      res.status(200).json({ 
        success: true,
        deployment: {
          id: deployment.id,
          url: deployment.url,
          adminUrl: deployment.admin_url,
          state: deployment.state
        }
      });
    } catch (error: any) {
      console.error('Error triggering Netlify deployment:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get deployment status
  app.post("/api/netlify/deployment-status", async (req, res) => {
    try {
      const { accessToken, deployId } = req.body;
      
      if (!accessToken || !deployId) {
        return res.status(400).json({ 
          message: 'Netlify access token and deploy ID are required' 
        });
      }
      
      const netlifyService = new NetlifyService(accessToken);
      const deployment = await netlifyService.getDeployment(deployId);
      
      res.status(200).json({ 
        deployment: {
          id: deployment.id,
          url: deployment.url,
          adminUrl: deployment.admin_url,
          state: deployment.state,
          createdAt: deployment.created_at,
          updatedAt: deployment.updated_at
        }
      });
    } catch (error: any) {
      console.error('Error getting Netlify deployment status:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ==============================================
  // NETLIFY OAUTH ROUTES
  // ==============================================

  // Get Netlify OAuth authorization URL
  app.get("/api/netlify/oauth/authorize", async (req, res) => {
    try {
      const { NetlifyOAuthService } = await import("./services/netlifyOAuthService");
      const oauthService = new NetlifyOAuthService();
      
      if (!oauthService.isConfigured()) {
        return res.status(500).json({ 
          message: 'Netlify OAuth is not configured. Please set NETLIFY_OAUTH_CLIENT_ID and NETLIFY_OAUTH_CLIENT_SECRET.' 
        });
      }

      // Generate a state parameter for CSRF protection
      const state = Math.random().toString(36).substring(7);
      
      // Store state in session or return it to be stored client-side
      const authUrl = oauthService.getAuthorizationUrl(state);
      
      res.status(200).json({ 
        authUrl,
        state
      });
    } catch (error: any) {
      console.error('Error generating Netlify OAuth URL:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Handle Netlify OAuth callback
  app.get("/api/netlify/oauth/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.status(400).json({ message: 'Authorization code is required' });
      }

      const { NetlifyOAuthService } = await import("./services/netlifyOAuthService");
      const oauthService = new NetlifyOAuthService();
      
      // Exchange code for access token
      const tokenData = await oauthService.exchangeCodeForToken(code as string);
      
      // Validate the token and get user info
      const validation = await oauthService.validateToken(tokenData.access_token);
      
      if (!validation.valid) {
        return res.status(401).json({ message: 'Invalid access token received' });
      }

      // Create a Personal Access Token for long-term use
      try {
        const patData = await oauthService.createPersonalAccessToken(tokenData.access_token);
        
        // Return success page with the PAT and user info
        res.send(`
          <html>
            <head>
              <title>Netlify Authentication Success</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .success { color: #059669; background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .token { background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; }
                .button { background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; }
              </style>
            </head>
            <body>
              <div class="success">
                <h2>✅ Netlify Authentication Successful!</h2>
                <p><strong>Welcome:</strong> ${validation.user.name} (${validation.user.email})</p>
                <p><strong>Sites:</strong> ${validation.user.site_count}</p>
              </div>
              
              <h3>Personal Access Token Created</h3>
              <p>Your Personal Access Token has been created and is ready to use:</p>
              <div class="token">${patData.access_token}</div>
              
              <p style="margin-top: 30px;">
                <a href="/" class="button">Return to Weblisite</a>
              </p>
              
              <script>
                // Store the access token and user info for the main app
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'NETLIFY_OAUTH_SUCCESS',
                    accessToken: '${patData.access_token}',
                    user: ${JSON.stringify(validation.user)}
                  }, window.location.origin);
                  window.close();
                } else {
                  // Store in localStorage as fallback
                  localStorage.setItem('netlify_access_token', '${patData.access_token}');
                  localStorage.setItem('netlify_user', '${JSON.stringify(validation.user)}');
                }
              </script>
            </body>
          </html>
        `);
      } catch (patError) {
        console.error('Error creating PAT:', patError);
        
        // Fallback: return the temporary token with a warning
        res.send(`
          <html>
            <head>
              <title>Netlify Authentication Success</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .success { color: #059669; background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .warning { color: #d97706; background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .token { background: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; }
                .button { background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; }
              </style>
            </head>
            <body>
              <div class="success">
                <h2>✅ Netlify Authentication Successful!</h2>
                <p><strong>Welcome:</strong> ${validation.user.name} (${validation.user.email})</p>
                <p><strong>Sites:</strong> ${validation.user.site_count}</p>
              </div>
              
              <div class="warning">
                <h3>⚠️ Using Temporary Token</h3>
                <p>Could not create a Personal Access Token. Using temporary OAuth token instead.</p>
              </div>
              
              <div class="token">${tokenData.access_token}</div>
              
              <p style="margin-top: 30px;">
                <a href="/" class="button">Return to Weblisite</a>
              </p>
              
              <script>
                // Store the access token and user info for the main app
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'NETLIFY_OAUTH_SUCCESS',
                    accessToken: '${tokenData.access_token}',
                    user: ${JSON.stringify(validation.user)}
                  }, window.location.origin);
                  window.close();
                } else {
                  // Store in localStorage as fallback
                  localStorage.setItem('netlify_access_token', '${tokenData.access_token}');
                  localStorage.setItem('netlify_user', '${JSON.stringify(validation.user)}');
                }
              </script>
            </body>
          </html>
        `);
      }
    } catch (error: any) {
      console.error('Error handling Netlify OAuth callback:', error);
      res.status(500).send(`
        <html>
          <head>
            <title>Netlify Authentication Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { color: #dc2626; background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>❌ Netlify Authentication Failed</h2>
              <p><strong>Error:</strong> ${error.message}</p>
            </div>
            
            <p style="margin-top: 30px;">
              <a href="/" class="button">Return to Weblisite</a>
            </p>
            
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'NETLIFY_OAUTH_ERROR',
                  error: '${error.message}'
                }, window.location.origin);
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    }
  });

  // Validate Netlify OAuth token (separate from the existing validate route)
  app.post("/api/netlify/oauth/validate", async (req, res) => {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: 'Netlify access token is required' });
      }

      const { NetlifyOAuthService } = await import("./services/netlifyOAuthService");
      const oauthService = new NetlifyOAuthService();
      const validation = await oauthService.validateToken(accessToken);
      
      res.status(200).json({
        valid: validation.valid,
        user: validation.user
      });
    } catch (error: any) {
      console.error('Error validating Netlify OAuth token:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Verify and deploy after payment is completed
  app.post("/api/deploy", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      // If paymentIntentId is provided, verify the payment with Stripe
      if (paymentIntentId && process.env.STRIPE_SECRET_KEY) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          
          if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ 
              message: `Payment not completed. Status: ${paymentIntent.status}` 
            });
          }
          
          // Log successful payment verification
          console.log(`Verified payment for: ${paymentIntentId}`);
        } catch (stripeError: any) {
          console.error('Error verifying payment with Stripe:', stripeError);
          // For development purposes, continue with deployment even if verification fails
          if (process.env.NODE_ENV !== 'development') {
            return res.status(400).json({ message: 'Payment verification failed' });
          }
          console.warn('Proceeding with deployment despite payment verification failure (development mode)');
        }
      } else if (paymentIntentId) {
        console.warn('Stripe secret key not configured, skipping payment verification');
      }
      
      // Deploy the project
      const deployResult = await deployService.deployProject();
      
      // Return the deployment URLs to the client
      res.status(200).json({ 
        deployUrl: deployResult.deployUrl,
        adminUrl: deployResult.adminUrl
      });
    } catch (error: any) {
      console.error('Error deploying project:', error);
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}

/**
 * Helper function to get all files recursively in a directory
 * Returns relative paths to the base directory
 */
async function getAllFilesRecursively(baseDir: string): Promise<string[]> {
  const files: string[] = [];
  
  async function traverseDirectory(dirPath: string, relativePath: string = '') {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const entryRelativePath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively traverse subdirectories
          await traverseDirectory(fullPath, entryRelativePath);
        } else {
          // Add file with relative path to the list
          files.push(entryRelativePath);
        }
      }
    } catch (error) {
      console.error(`Error traversing directory ${dirPath}:`, error);
    }
  }
  
  await traverseDirectory(baseDir);
  return files;
}

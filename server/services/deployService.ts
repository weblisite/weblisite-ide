import { storage } from '../storage';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';
import archiver from 'archiver';
import fetch from 'node-fetch';
import FormData from 'form-data';

const execPromise = util.promisify(exec);

interface NetlifyDeployResponse {
  id: string;
  site_id: string;
  deploy_url: string;
  url: string;
  ssl_url: string;
  admin_url: string;
  deploy_ssl_url: string;
}

export class DeployService {
  private projectDir: string;
  private tempDir: string;
  private authToken: string;
  
  constructor(private projectId: number) {
    this.projectDir = path.join(process.cwd(), 'project');
    this.tempDir = path.join(process.cwd(), 'temp');
    
    // Get the Netlify auth token from environment variables
    this.authToken = process.env.NETLIFY_AUTH_TOKEN || '';
    if (!this.authToken) {
      console.warn('NETLIFY_AUTH_TOKEN environment variable is not set, deployment will fail');
    }
  }
  
  /**
   * Deploy the project to Netlify using their API
   * This uploads the project files as a zip and creates a new deployment
   */
  async deployProject(): Promise<{ deployUrl: string, adminUrl: string }> {
    console.log('Deploying project to Netlify...');
    
    if (!this.authToken) {
      throw new Error('Netlify authentication token is not configured');
    }
    
    try {
      // 1. Create a zip file of the project
      const zipFilePath = await this.createProjectZip();
      
      // 2. Deploy to Netlify using their API
      const deployResponse = await this.uploadToNetlify(zipFilePath);
      
      // 3. Store the deployment in the database
      await storage.createDeployment({
        project_id: this.projectId,
        url: deployResponse.ssl_url,
        status: 'success'
      });
      
      // 4. Clean up the temporary zip file
      fs.unlinkSync(zipFilePath);
      
      return {
        deployUrl: deployResponse.ssl_url,
        adminUrl: deployResponse.admin_url
      };
    } catch (error) {
      console.error('Error deploying project to Netlify:', error);
      
      // Record failed deployment
      await storage.createDeployment({
        project_id: this.projectId,
        url: '',
        status: 'error'
      });
      
      throw error;
    }
  }
  
  /**
   * Create a zip file of the project for deployment
   */
  private async createProjectZip(): Promise<string> {
    const zipFilePath = path.join(this.tempDir, `deploy-${this.projectId}-${Date.now()}.zip`);
    
    // Make sure the temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
    
    return new Promise((resolve, reject) => {
      // Create a file to stream archive data to
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
      });
      
      // Listen for all archive data to be written
      output.on('close', () => {
        console.log(`Project zipped successfully: ${archive.pointer()} total bytes`);
        resolve(zipFilePath);
      });
      
      // Handle warnings and errors
      archive.on('warning', (err: any) => {
        if (err.code === 'ENOENT') {
          console.warn('Archive warning:', err);
        } else {
          reject(err);
        }
      });
      
      archive.on('error', (err: any) => {
        reject(err);
      });
      
      // Pipe archive data to the file
      archive.pipe(output);
      
      // Add files from the project directory
      archive.directory(path.join(this.projectDir, 'src'), 'src');
      
      // Add the project's public directory if it exists
      const publicPath = path.join(this.projectDir, 'public');
      if (fs.existsSync(publicPath)) {
        archive.directory(publicPath, 'public');
      }
      
      // Add root project files for Vite
      [
        'index.html',
        'vite.config.js',
        'postcss.config.js',
        'tailwind.config.js',
        'package.json'
      ].forEach(file => {
        const filePath = path.join(this.projectDir, file);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: file });
        } else {
          console.warn(`Project file not found: ${file}`);
        }
      });
      
      // Add a netlify.toml file to ensure proper Vite SPA routing
      const netlifyConfig = `
[build]
  publish = "dist"
  command = "npm install && npm run build"

[dev]
  command = "npm run dev"
  port = 5173
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
      
      archive.append(netlifyConfig, { name: 'netlify.toml' });
      
      // Finalize the archive
      archive.finalize();
    });
  }
  
  /**
   * Upload the project zip to Netlify using their API
   */
  private async uploadToNetlify(zipFilePath: string): Promise<NetlifyDeployResponse> {
    const apiUrl = 'https://api.netlify.com/api/v1/sites';
    
    // Prepare the form data with the zip file
    const formData = new FormData();
    formData.append('file', fs.createReadStream(zipFilePath));
    formData.append('name', `weblisite-project-${this.projectId}`);
    
    // Make the API request to Netlify
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      },
      body: formData as any
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Netlify API error (${response.status}): ${errorText}`);
    }
    
    return await response.json() as NetlifyDeployResponse;
  }
}

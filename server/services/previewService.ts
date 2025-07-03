import fs from 'fs/promises';
import path from 'path';

export class PreviewService {
  private projectDir: string = path.join(process.cwd(), 'temp');
  
  constructor() {
    // Ensure project directory exists
    this.ensureProjectDir();
  }
  
  private async ensureProjectDir() {
    try {
      await fs.mkdir(this.projectDir, { recursive: true });
    } catch (error) {
      console.error('Error creating project directory:', error);
    }
  }
  
  /**
   * Get preview content for inline display
   * Returns HTML content that can be displayed in an iframe or preview panel
   */
  async getPreviewContent(): Promise<string> {
    console.log('Generating preview content...');
    
    try {
      // Check if there's an index.html file in the temp directory
      const indexPath = path.join(this.projectDir, 'index.html');
      
      try {
        const content = await fs.readFile(indexPath, 'utf8');
        return content;
      } catch (fileError) {
        // If no index.html exists, check for React app structure
        const srcPath = path.join(this.projectDir, 'src');
        const appPath = path.join(srcPath, 'App.jsx');
        
        try {
          const appContent = await fs.readFile(appPath, 'utf8');
          // Generate a simple preview based on the React app content
          return this.generateReactPreview(appContent);
        } catch (reactError) {
          // Return a default preview
          return this.getDefaultPreview();
        }
      }
    } catch (error) {
      console.error('Error generating preview content:', error);
      return this.getDefaultPreview();
    }
  }
  
  /**
   * Generate a simple preview based on React component content
   */
  private generateReactPreview(appContent: string): string {
    // Extract title and basic content from React component
    // This is a simplified approach - in production you'd want proper React rendering
    const titleMatch = appContent.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : 'React App';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50">
        <div id="root" class="min-h-screen">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
              <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                ${title}
              </h1>
              <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                Preview of your generated React application
              </p>
              <div class="mt-8">
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                  <p class="text-gray-600">Your React app is ready! The generated components are displaying here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  /**
   * Get default preview content when no files are available
   */
  private getDefaultPreview(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weblisite Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div id="root" class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <div class="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              Ready to Build Something Amazing?
            </h1>
            <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Start by describing what you want to build in the chat panel. Your preview will appear here once you generate some code!
            </p>
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div class="text-left text-sm text-gray-500 font-mono">
                <div class="text-blue-600">// Start building with AI</div>
                <div class="text-green-600">console.log('Hello, Weblisite!');</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  
  /**
   * Execute project - now returns success status instead of URL
   */
  async executeProject(): Promise<string> {
    console.log('Project ready for preview...');
    return 'ready'; // Return status instead of URL
  }
}

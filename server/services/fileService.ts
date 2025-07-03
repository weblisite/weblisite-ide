import fs from 'fs/promises';
import path from 'path';
import { storage } from '../storage';
import { FileItem } from '../../client/src/types';
import { syntaxValidator } from '../utils/syntaxValidator';

export class FileService {
  private projectDir: string = path.join(process.cwd(), 'project');
  
  constructor(private projectId: number) {
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
   * Get all files in the project
   */
  async getFiles(): Promise<FileItem[]> {
    try {
      // Fetch files from storage
      const files = await storage.getFilesByProjectId(this.projectId);
      
      // Map to FileItem format
      return files.map(file => ({
        path: file.path,
        name: path.basename(file.path)
      }));
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }
  
  /**
   * Get a file's content
   */
  async getFileContent(filePath: string): Promise<string> {
    try {
      // Get file from storage
      const file = await storage.getFileByPath(this.projectId, filePath);
      
      if (!file) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      return file.content;
    } catch (error) {
      console.error(`Error fetching file content for ${filePath}:`, error);
      throw error;
    }
  }
  
  /**
   * Create or update a file
   */
  async createOrUpdateFile(filePath: string, content: string): Promise<void> {
    try {
      console.log(`Processing file for saving: ${filePath}`);
      
      // Run syntax validation before saving
      let validatedContent = content;
      
      // Only validate JS/TS files
      const fileExt = path.extname(filePath).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExt)) {
        console.log(`Validating syntax for ${filePath}...`);
        validatedContent = await syntaxValidator.validateBeforeSave(filePath, content);
        
        // If content was modified, log it
        if (validatedContent !== content) {
          console.log(`Syntax validation fixed issues in ${filePath}`);
        }
      }
      
      // Check if file exists
      const existingFile = await storage.getFileByPath(this.projectId, filePath);
      
      // Ensure directory exists in the filesystem
      const fileDirPath = path.join(this.projectDir, path.dirname(filePath));
      await fs.mkdir(fileDirPath, { recursive: true });
      
      // Always write to the filesystem with the validated content
      await fs.writeFile(path.join(this.projectDir, filePath), validatedContent);
      
      if (existingFile) {
        // Update existing file in storage
        await storage.updateFile(existingFile.id, validatedContent);
        console.log(`Updated existing file: ${filePath}`);
      } else {
        // Create new file in storage
        await storage.createFile({
          project_id: this.projectId,
          path: filePath,
          content: validatedContent
        });
        console.log(`Created new file: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error creating/updating file ${filePath}:`, error);
      throw error;
    }
  }
}

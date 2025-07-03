import Anthropic from '@anthropic-ai/sdk';

// Create a singleton instance of the Anthropic client
let anthropicInstance: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    console.log('Anthropic client initialized');
  }
  
  return anthropicInstance;
}

// Claude 4 Sonnet - the latest and most advanced AI model
export const CLAUDE_MODEL = 'claude-4-sonnet';

/**
 * Parse response for file generation requests
 * Extracts files from structured Claude response
 */
export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * Parse a Claude response into a list of files
 */
export async function parseClaudeResponse(response: string): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  
  try {
    // Look for markdown code blocks with filenames
    const filePattern = /```(\S+)\s*\n([\s\S]*?)```/g;
    let match;
    
    while ((match = filePattern.exec(response)) !== null) {
      const filePath = match[1].trim();
      let content = match[2].trim();
      
      // Skip if it's not a file path pattern or it's a language marker like ```javascript
      if (filePath.includes('/') || filePath.includes('.')) {
        files.push({
          path: filePath.trim(),
          content: content
        });
      }
    }
    
    // If the above pattern didn't find any files, try an alternative format
    if (files.length === 0) {
      // Look for structured sections with file paths and content
      const sectionPattern = /## (File|Path): (.*?)\s*\n([\s\S]*?)(?=## |$)/g;
      
      while ((match = sectionPattern.exec(response)) !== null) {
        const filePath = match[2].trim();
        const sectionContent = match[3].trim();
        
        // Extract content from code blocks if present
        const codeBlockMatch = /```.*?\n([\s\S]*?)```/g.exec(sectionContent);
        const content = codeBlockMatch ? codeBlockMatch[1].trim() : sectionContent;
        
        files.push({
          path: filePath,
          content: content
        });
      }
    }
    
    return files;
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    return [];
  }
}
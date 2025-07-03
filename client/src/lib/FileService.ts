import { FileItem } from '../types';

/**
 * Fetch all files in the project
 */
export const fetchFiles = async (): Promise<FileItem[]> => {
  try {
    const response = await fetch('/api/files');
    
    if (!response.ok) {
      throw new Error(`File service error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

/**
 * Fetch a single file's content
 */
export const fetchFileContent = async (path: string): Promise<string> => {
  try {
    const response = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    
    if (!response.ok) {
      throw new Error(`File service error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error(`Error fetching file content for ${path}:`, error);
    throw error;
  }
};

/**
 * Update a file's content or create a new file
 */
export const updateFile = async (path: string, content: string): Promise<void> => {
  try {
    const response = await fetch('/api/update-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    });
    
    if (!response.ok) {
      throw new Error(`File update error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error updating file ${path}:`, error);
    throw error;
  }
};

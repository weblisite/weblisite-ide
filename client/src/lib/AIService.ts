// AIService.ts - Client-side service for AI interactions

import { FileItem } from '../types';

/**
 * Sends a message to the AI assistant for code generation
 */
export const sendMessage = async (message: string, userId?: string): Promise<Response> => {
  try {
    // Add timeout mechanism to prevent hanging indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: message,
        userId: userId 
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`AI service error: ${response.status}`);
      throw new Error(`AI service error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error in AI service:', error);
    
    // If it's an abort error (timeout), provide a clearer message
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Request timed out after 2 minutes');
      return new Response(JSON.stringify({
        error: true,
        message: 'Request timed out. The server took too long to respond. Try again with a simpler prompt.'
      }), {
        status: 408,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return a proper error response instead of throwing
    return new Response(JSON.stringify({
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Sends an error message to the AI assistant for error fixing
 */
export const sendErrorFixMessage = async (errorMessage: string, userId?: string): Promise<Response> => {
  try {
    // Add timeout mechanism to prevent hanging indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    const response = await fetch('/api/fix-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        errorMessage: errorMessage,
        userId: userId 
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Error fixing service error: ${response.status}`);
      throw new Error(`Error fixing service error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error in error fixing service:', error);
    
    // If it's an abort error (timeout), provide a clearer message
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Error fixing request timed out after 2 minutes');
      return new Response(JSON.stringify({
        error: true,
        message: 'Error fixing timed out. The error might be too complex to resolve automatically.'
      }), {
        status: 408,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return a proper error response instead of throwing
    return new Response(JSON.stringify({
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Create or update a file in the project
 */
export const createOrUpdateFile = async (path: string, content: string): Promise<FileItem> => {
  try {
    const response = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create/update file: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating/updating file:', error);
    throw error;
  }
};

/**
 * Saves the currently edited file to the server
 */
export const saveFile = async (path: string, content: string): Promise<void> => {
  try {
    const response = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to save file: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

/**
 * Saves all files to the server
 */
export const saveAllFiles = async (files: { path: string; content: string }[]): Promise<void> => {
  try {
    const savePromises = files.map(file => saveFile(file.path, file.content || ''));
    await Promise.all(savePromises);
  } catch (error) {
    console.error('Error saving all files:', error);
    throw error;
  }
};

/**
 * Sends a message to Claude 4 Sonnet directly and returns the completion
 */
export const sendDirectClaudeMessage = async (
  prompt: string, 
  maxTokens: number = 2000, 
  temperature: number = 0.7
): Promise<any> => {
  try {
    // Add timeout mechanism to prevent hanging indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    const response = await fetch('/api/claude-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        max_tokens: maxTokens,
        temperature 
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      throw new Error(
        `Claude API error: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    // If it's an abort error (timeout), provide a clearer message
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Claude API request timed out after 2 minutes');
      return {
        error: true,
        message: 'Request timed out. Claude took too long to respond. Try again with a simpler prompt.'
      };
    }
    
    // Return an error object instead of throwing
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Sends a streaming message to Claude and handles real-time responses
 */
export const sendStreamingClaudeMessage = async (
  prompt: string,
  mode: 'chat' | 'debug' = 'chat',
  onChunk: (text: string) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: string) => void,
  maxTokens: number = 2000,
  temperature: number = 0.7
): Promise<void> => {
  try {
    const response = await fetch('/api/claude-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        mode,
        max_tokens: maxTokens,
        temperature 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'start':
                  // Stream started
                  break;
                case 'chunk':
                  onChunk(data.text);
                  break;
                case 'complete':
                  onComplete(data.fullResponse);
                  return;
                case 'error':
                  onError(data.message);
                  return;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Error in streaming request:', error);
    onError(error instanceof Error ? error.message : 'Unknown streaming error');
  }
};

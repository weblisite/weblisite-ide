import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { FileItem, Message } from '../types';
import { socket } from '../lib/socket';
import { useToast } from "@/hooks/use-toast";
import { sendDirectClaudeMessage, sendStreamingClaudeMessage, sendMessage, sendErrorFixMessage } from '../lib/AIService';
import { useAuth } from './AuthContext';
import * as monaco from 'monaco-editor';

interface WeblisiteContextProps {
  files: FileItem[];
  setFiles: (files: FileItem[]) => void;
  selectedFile: FileItem | null;
  setSelectedFile: (file: FileItem | null) => void;
  fileContent: string;
  setFileContent: (content: string) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  currentGeneratingFile: string | null;
  setCurrentGeneratingFile: (file: string | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  supabaseConfig: { url: string; key: string } | null;
  setSupabaseConfig: (config: { url: string; key: string } | null) => void;
  isDbModalOpen: boolean;
  setIsDbModalOpen: (open: boolean) => void;
  isDeployModalOpen: boolean;
  setIsDeployModalOpen: (open: boolean) => void;
  isGitHubModalOpen: boolean;
  setIsGitHubModalOpen: (open: boolean) => void;
  isNetlifyModalOpen: boolean;
  setIsNetlifyModalOpen: (open: boolean) => void;
  isUserProfileOpen: boolean;
  setIsUserProfileOpen: (open: boolean) => void;
  deployedUrl: string | null;
  setDeployedUrl: (url: string | null) => void;
  createOrUpdateFile: (path: string, content: string) => Promise<void>;
  saveFile: (file: FileItem, content: string) => Promise<void>;
  handleUserMessage: (message: string) => Promise<void>;
  askClaude: (prompt: string) => Promise<void>;
  fixError: (errorMessage: string) => Promise<void>;
  editorInstance: monaco.editor.IStandaloneCodeEditor | null;
  setEditorInstance: (editor: monaco.editor.IStandaloneCodeEditor | null) => void;
  // GitHub integration
  githubAccessToken: string | null;
  setGithubAccessToken: (token: string | null) => void;
  githubUser: any;
  setGithubUser: (user: any) => void;
  lastPushedRepo: { url: string; name: string; owner: string } | null;
  setLastPushedRepo: (repo: { url: string; name: string; owner: string } | null) => void;
  // Netlify integration
  netlifyAccessToken: string | null;
  setNetlifyAccessToken: (token: string | null) => void;
  netlifyUser: any;
  setNetlifyUser: (user: any) => void;
  isNetlifyConnected: boolean;
  setIsNetlifyConnected: (connected: boolean) => void;
  // Database integration
  isDatabaseIntegrationModalOpen: boolean;
  setIsDatabaseIntegrationModalOpen: (open: boolean) => void;
  supabaseProject: any;
  setSupabaseProject: (project: any) => void;
  databaseSchema: any;
  setDatabaseSchema: (schema: any) => void;
  isDatabaseConnected: boolean;
  setIsDatabaseConnected: (connected: boolean) => void;
}

const WeblisiteContext = createContext<WeblisiteContextProps | undefined>(undefined);

export const WeblisiteProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to Weblisite! I\'m your AI coding assistant. I can help you turn your idea into a fully functional web app. What do you want to build?'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentGeneratingFile, setCurrentGeneratingFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [supabaseConfig, setSupabaseConfig] = useState<{ url: string; key: string } | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [isNetlifyModalOpen, setIsNetlifyModalOpen] = useState<boolean>(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Add GitHub integration state
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState<any>(null);
  const [lastPushedRepo, setLastPushedRepo] = useState<{
    url: string;
    name: string;
    owner: string;
  } | null>(null);
  
  // Add Netlify integration state
  const [netlifyAccessToken, setNetlifyAccessToken] = useState<string | null>(null);
  const [netlifyUser, setNetlifyUser] = useState<any>(null);
  const [isNetlifyConnected, setIsNetlifyConnected] = useState(false);

  // Add Database integration state
  const [isDatabaseIntegrationModalOpen, setIsDatabaseIntegrationModalOpen] = useState(false);
  const [supabaseProject, setSupabaseProject] = useState<any>(null);
  const [databaseSchema, setDatabaseSchema] = useState<any>(null);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updatePreview = useCallback(async () => {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update preview');
      }
      
      // Preview URL will be received via socket.io
    } catch (error) {
      console.error('Failed to update preview:', error);
      toast({
        title: "Preview Error",
        description: "Failed to update the live preview.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const createOrUpdateFile = useCallback(async (path: string, content: string, showToast: boolean = true) => {
    try {
      const response = await fetch('/api/update-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update file');
      }
      
      // Update the files list if it's a new file
      if (!files.some(f => f.path === path)) {
        const parts = path.split('/');
        const name = parts[parts.length - 1];
        
        setFiles(prev => [...prev, { path, name }]);
      }
      
      // Update the last saved content tracking
      setLastSavedContent(prev => ({
        ...prev,
        [path]: content
      }));
      
      // Only show toast if requested (for manual saves)
      if (showToast) {
      toast({
        title: "File Saved",
        description: `${path} has been saved successfully.`,
          duration: 2000,
      });
      }
      
      // Update preview
      updatePreview();
    } catch (error) {
      console.error('Failed to update file:', error);
      if (showToast) {
      toast({
        title: "Save Error",
        description: "Failed to save the file.",
        variant: "destructive",
      });
      }
    }
  }, [files, toast, updatePreview]);

  const saveFile = useCallback(async (file: FileItem, content: string) => {
    await createOrUpdateFile(file.path, content);
  }, [createOrUpdateFile]);

  const handleUserMessage = useCallback(async (content: string) => {
    // Add user message
    addMessage({ role: 'user', content });
    
    // Add temporary assistant message
    addMessage({ 
      role: 'assistant', 
      content: 'I\'ll help you create that...',
      isTyping: true 
    });
    
    setIsGenerating(true);
    
    try {
      // Use XMLHttpRequest to avoid page reloads on fetch errors
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/generate', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success - the generation process has started
          // No need to do anything here since the server sends 200 immediately
          // and the actual generation happens via websockets
          
          // Remove the temporary message - we'll get real updates via socket
          setMessages(prev => prev.slice(0, -1));
        } else {
          // Handle error
          throw new Error('Failed to generate code');
        }
      };
      
      xhr.onerror = function() {
        throw new Error('Network error occurred');
      };
      
      xhr.send(JSON.stringify({ prompt: content, userId: user?.id }));
    } catch (error) {
      console.error('Failed to generate code:', error);
      setIsGenerating(false);
      
      // Remove the temporary message
      setMessages(prev => prev.slice(0, -1));
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating code. Please try again.'
      });
      
      toast({
        title: "Generation Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    }
  }, [addMessage, toast, user?.id]);
  
    const askClaude = useCallback(async (prompt: string) => {
    // Add user message
    addMessage({ role: 'user', content: prompt });
    
    // Add temporary assistant message that will be updated with streaming content
    const streamingMessageId = Date.now();
    addMessage({ 
      role: 'assistant', 
      content: '',
      isTyping: true,
      id: streamingMessageId
    });

    let streamingContent = '';

    try {
      await sendStreamingClaudeMessage(
        prompt,
        'chat',
        // onChunk - update message with new content
        (chunk: string) => {
          streamingContent += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === streamingMessageId 
                ? { ...msg, content: streamingContent }
                : msg
            )
          );
        },
        // onComplete - finalize the message
        (fullResponse: string) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === streamingMessageId 
                ? { ...msg, content: fullResponse, isTyping: false }
                : msg
            )
          );
        },
        // onError - handle errors
        (error: string) => {
          console.error('Streaming error:', error);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === streamingMessageId 
                ? { 
                    ...msg, 
                    content: 'Sorry, I encountered an error processing your request. Please try again.',
                    isTyping: false 
                  }
                : msg
            )
          );
          
          toast({
            title: "Claude Error",
            description: "Failed to connect to Claude API. Please try again.",
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      console.error('Failed to start Claude streaming:', error);
      
      // Update the message with error content
      setMessages(prev => 
        prev.map(msg => 
          msg.id === streamingMessageId 
            ? { 
                ...msg, 
                content: 'Sorry, I encountered an error processing your request. Please try again.',
                isTyping: false 
              }
            : msg
        )
      );
      
      toast({
        title: "Claude Error",
        description: "Failed to connect to Claude API. Please try again.",
        variant: "destructive",
      });
    }
  }, [addMessage, toast]);
  
  const fixError = useCallback(async (errorMessage: string) => {
    // Add user message with error
    addMessage({ role: 'user', content: `🐛 Debug: ${errorMessage}` });
    
    // Add temporary assistant message
    addMessage({ 
      role: 'assistant', 
      content: 'I\'ll analyze and fix this error for you...',
      isTyping: true 
    });

    setIsGenerating(true);

    try {
      // Use the error fixing service with user preferences
      const response = await sendErrorFixMessage(errorMessage, user?.id);
      
      if (!response.ok) {
        throw new Error('Failed to fix error');
      }
      
      // Remove the temporary message - we'll get real updates via socket
      setMessages(prev => prev.slice(0, -1));
    } catch (error) {
      console.error('Failed to fix error:', error);
      setIsGenerating(false);
      
      // Remove the temporary message
      setMessages(prev => prev.slice(0, -1));
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while trying to fix the issue. Please try again or provide more details.'
      });
      
      toast({
        title: "Error Fixing Failed",
        description: "Failed to fix the error. Please try again.",
        variant: "destructive",
      });
    }
  }, [addMessage, user?.id, toast]);

  // Handle socket events
  useEffect(() => {
    const handleFileCreated = (file: FileItem) => {
      setFiles(prev => {
        // Don't add duplicate files
        if (prev.some(f => f.path === file.path)) {
          return prev;
        }
        return [...prev, file];
      });
      
      setSelectedFile(file);
      setFileContent('');
      setCurrentGeneratingFile(file.path);
    };

    const handleFileContent = ({ path, chunk }: { path: string; chunk: string }) => {
      if (selectedFile?.path === path) {
        // Simply append the chunk to maintain code integrity
        // while still getting a typewriter-like effect from the small chunks
        setFileContent(prev => prev + chunk);
        
        // Auto-scroll the editor when new content is added
        if (editorInstance) {
          // Use setTimeout to ensure the state update is processed first
          setTimeout(() => {
            const lineCount = editorInstance.getModel()?.getLineCount() || 0;
            if (lineCount > 0) {
              // Scroll to the bottom of the editor
              editorInstance.revealLine(lineCount);
            }
          }, 0);
        }
      }
    };
    
    const handleFileGenerated = (path: string) => {
      if (currentGeneratingFile === path) {
        setCurrentGeneratingFile(null);
        
        // Auto-save the file to ensure it's persisted
        if (selectedFile?.path === path && fileContent) {
          // Save the file to prevent loss on refresh
          createOrUpdateFile(path, fileContent)
            .then(() => {
              console.log(`Auto-saved completed file: ${path}`);
            })
            .catch(error => {
              console.error(`Error auto-saving file ${path}:`, error);
            });
        }
        
        // Add a message to show completion
        addMessage({
          role: 'assistant',
          content: `✓ Created ${path}`
        });
      }
    };
    
    const handleGenerationComplete = () => {
      setIsGenerating(false);
      setCurrentGeneratingFile(null);
      
      // Auto-save the currently selected file if it exists
      if (selectedFile && fileContent) {
        // Save the current file to prevent loss on refresh
        createOrUpdateFile(selectedFile.path, fileContent)
          .then(() => {
            console.log(`Final auto-save completed for: ${selectedFile.path}`);
          })
          .catch(error => {
            console.error(`Error with final auto-save for ${selectedFile.path}:`, error);
          });
      }
      
      // Trigger preview update
      updatePreview();
      
      // Add a message to show completion
      addMessage({
        role: 'assistant',
        content: `✅ Generation complete! All files have been automatically saved.`
      });
    };
    
    const handlePreviewReady = (url: string) => {
      setPreviewUrl(url);
    };
    
    const handleGenerationError = (error: { message: string }) => {
      setIsGenerating(false);
      setCurrentGeneratingFile(null);
      
      // Add error message to chat
      addMessage({
        role: 'assistant',
        content: `Error generating code: ${error.message}`
      });
      
      toast({
        title: "Generation Error",
        description: error.message,
        variant: "destructive",
      });
    };
    
    const handleAssistantMessage = (message: { role?: string, content: string }) => {
      // Add the message to the chat
      addMessage({
        role: 'assistant', // Always set as assistant since these come from the server
        content: message.content
      });
    };

    socket.on('file-created', handleFileCreated);
    socket.on('file-content', handleFileContent);
    socket.on('file-generated', handleFileGenerated);
    socket.on('generation-complete', handleGenerationComplete);
    socket.on('preview-ready', handlePreviewReady);
    socket.on('generation-error', handleGenerationError);
    socket.on('assistant-message', handleAssistantMessage);

    return () => {
      socket.off('file-created', handleFileCreated);
      socket.off('file-content', handleFileContent);
      socket.off('file-generated', handleFileGenerated);
      socket.off('generation-complete', handleGenerationComplete);
      socket.off('preview-ready', handlePreviewReady);
      socket.off('generation-error', handleGenerationError);
      socket.off('assistant-message', handleAssistantMessage);
    };
  }, [selectedFile, currentGeneratingFile, addMessage, updatePreview, editorInstance, createOrUpdateFile, fileContent]);

  // Initialize - fetch initial files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
          
          // If files are loaded but no file is selected, select the first one
          if (data.length > 0 && !selectedFile) {
            setSelectedFile(data[0]);
            
            // Fetch the file content
            try {
              const contentResponse = await fetch(`/api/file?path=${encodeURIComponent(data[0].path)}`);
              if (contentResponse.ok) {
                const contentData = await contentResponse.json();
                setFileContent(contentData.content);
              }
            } catch (contentError) {
              console.error('Failed to fetch file content:', contentError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };
    
    fetchFiles();
    
    // Also attempt to execute the preview right away
    updatePreview();
  }, [selectedFile, updatePreview]);
  
  // Track last saved content to avoid unnecessary saves
  const [lastSavedContent, setLastSavedContent] = useState<{[path: string]: string}>({});
  const lastSavedContentRef = useRef<{[path: string]: string}>({});

  // Keep ref in sync with state
  useEffect(() => {
    lastSavedContentRef.current = lastSavedContent;
  }, [lastSavedContent]);

  // Update lastSavedContent when file is first selected/loaded
  useEffect(() => {
    if (selectedFile && fileContent && !lastSavedContent[selectedFile.path]) {
      setLastSavedContent(prev => ({
        ...prev,
        [selectedFile.path]: fileContent
      }));
    }
  }, [selectedFile, fileContent, lastSavedContent]);

  // Add auto-save timer for current file (only save when content changes)
  useEffect(() => {
    if (!selectedFile || !fileContent || isGenerating) {
      // Don't auto-save if no file is selected, no content, or during generation
      return;
    }
    
    // Set up an auto-save timer (every 30 seconds)
    const autoSaveInterval = setInterval(() => {
      // Only auto-save if there's content, not generating, and content has changed
      if (selectedFile && fileContent && !isGenerating && !currentGeneratingFile) {
        const lastContent = lastSavedContentRef.current[selectedFile.path] || '';
        
        // Only save if the content has actually changed
        if (fileContent !== lastContent) {
          console.log(`Auto-saving ${selectedFile.path} (content changed)...`);
        
          // Auto-save without showing toast (showToast: false)
          createOrUpdateFile(selectedFile.path, fileContent, false)
          .then(() => {
            console.log(`Auto-save successful: ${selectedFile.path}`);
          })
          .catch(error => {
            console.error(`Auto-save failed for ${selectedFile.path}:`, error);
          });
        } else {
          console.log(`Skipping auto-save for ${selectedFile.path} - no changes detected`);
        }
      }
    }, 30000); // 30 seconds
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [selectedFile, fileContent, isGenerating, currentGeneratingFile, createOrUpdateFile]);

  const value = {
    files,
    setFiles,
    selectedFile,
    setSelectedFile,
    fileContent,
    setFileContent,
    messages,
    addMessage,
    isGenerating,
    setIsGenerating,
    currentGeneratingFile,
    setCurrentGeneratingFile,
    previewUrl,
    setPreviewUrl,
    supabaseConfig,
    setSupabaseConfig,
    isDbModalOpen,
    setIsDbModalOpen,
    isDeployModalOpen,
    setIsDeployModalOpen,
    isGitHubModalOpen,
    setIsGitHubModalOpen,
    isNetlifyModalOpen,
    setIsNetlifyModalOpen,
    isUserProfileOpen,
    setIsUserProfileOpen,
    deployedUrl,
    setDeployedUrl,
    createOrUpdateFile,
    saveFile,
    handleUserMessage,
    askClaude,
    fixError,
    editorInstance,
    setEditorInstance,
    // GitHub integration
    githubAccessToken,
    setGithubAccessToken,
    githubUser,
    setGithubUser,
    lastPushedRepo,
    setLastPushedRepo,
    // Netlify integration
    netlifyAccessToken,
    setNetlifyAccessToken,
    netlifyUser,
    setNetlifyUser,
    isNetlifyConnected,
    setIsNetlifyConnected,
    // Database integration
    isDatabaseIntegrationModalOpen,
    setIsDatabaseIntegrationModalOpen,
    supabaseProject,
    setSupabaseProject,
    databaseSchema,
    setDatabaseSchema,
    isDatabaseConnected,
    setIsDatabaseConnected
  };

  return (
    <WeblisiteContext.Provider value={value}>
      {children}
    </WeblisiteContext.Provider>
  );
};

export const useWeblisite = () => {
  const context = useContext(WeblisiteContext);
  if (context === undefined) {
    throw new Error('useWeblisite must be used within a WeblisiteProvider');
  }
  return context;
};
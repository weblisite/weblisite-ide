import { useState, useRef, useEffect } from 'react';
import { useWeblisite } from '../context/WeblisiteContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ChatPanel = () => {
  const { 
    messages, 
    handleUserMessage, 
    askClaude,
    isGenerating,
    currentGeneratingFile,
    fixError
  } = useWeblisite();
  
  const [input, setInput] = useState('');
  const [directMode, setDirectMode] = useState<boolean>(false);
  const [errorFixMode, setErrorFixMode] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Helper function to check if text looks like an error message
  const looksLikeError = (text: string): boolean => {
    const errorPatterns = [
      /error/i,
      /exception/i,
      /failed/i,
      /cannot find/i,
      /is not defined/i,
      /unexpected token/i,
      /syntax error/i,
      /TypeError/i,
      /ReferenceError/i,
      /module not found/i
    ];
    
    return errorPatterns.some(pattern => pattern.test(text));
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for saved prompt from landing page and auto-submit
  useEffect(() => {
    const savedPrompt = localStorage.getItem('weblisite_initial_prompt');
    if (savedPrompt && !messages.length) {
      // Only auto-submit if there are no existing messages
      setInput(savedPrompt);
      
      // Auto-submit the prompt after a brief delay
      setTimeout(() => {
        handleUserMessage(savedPrompt);
        setInput('');
        // Clear the saved prompt so it doesn't auto-submit again
        localStorage.removeItem('weblisite_initial_prompt');
        
        toast({
          title: "Welcome to Weblisite!",
          description: "I'm starting to build your project based on your request.",
          duration: 5000,
        });
      }, 1000);
    }
  }, [handleUserMessage, messages.length, toast]);
  
  // Handle error fixing request
  const handleErrorFix = async () => {
    if (!input.trim() || isGenerating) return;
    
    try {
      // Use the context's fixError method instead of direct fetch
      await fixError(input);
      
      // The context's fixError will handle showing messages and error states
      
      // Show a simple toast notification that the process has started
      toast({
        title: "Error Fix Started",
        description: "I'm analyzing your error and will apply fixes automatically",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error in handleErrorFix:', error);
      // The fixError function should handle error cases, but we'll add an extra safeguard
      toast({
        title: "Error Fix Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload feature coming soon!",
      duration: 3000,
    });
  };

  // Handle image upload
  const handleImageUpload = () => {
    toast({
      title: "Image Upload",
      description: "Image upload feature coming soon!",
      duration: 3000,
    });
  };

  // Handle URL addition
  const handleUrlUpload = () => {
    toast({
      title: "URL Scraping",
      description: "URL scraping feature coming soon!",
      duration: 3000,
    });
  };

  // Handle Figma upload
  const handleFigmaUpload = () => {
    toast({
      title: "Figma Import",
      description: "Figma import feature coming soon!",
      duration: 3000,
    });
  };

  // Submit function is now implemented directly in button onClick and textarea onKeyDown
  
  return (
    <>
      {/* Premium Chat Messages - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 chat-container premium-scrollbar">
        {messages.map((message, index) => (
          <div className="group" key={index}>
            <div className={`flex items-start space-x-2 sm:space-x-4 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
              {message.role === 'assistant' && (
                <div className="relative flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg">
                    <i className="ri-robot-line text-blue-400 text-sm sm:text-lg"></i>
                  </div>
                </div>
              )}
              
              <div className={`flex-1 max-w-[90%] sm:max-w-[85%] ${message.role === 'user' ? 'ml-auto' : ''}`}>
                <div className={`relative backdrop-blur-sm border shadow-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                  message.role === 'assistant' 
                    ? 'bg-slate-800/60 border-white/10 text-slate-100' 
                    : 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500/30 text-white ml-auto'
                }`}>
                  {message.isTyping ? (
                    <div className="space-y-3">
                      {/* Show streaming content if available */}
                      {message.content ? (
                        <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {message.content}
                          <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <p className="text-sm font-medium">
                            {currentGeneratingFile 
                              ? `Creating ${currentGeneratingFile}...`
                              : 'AI is thinking...'
                            }
                          </p>
                        </div>
                      )}
                      
                      {currentGeneratingFile && !message.content && (
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <i className="ri-time-line"></i>
                          <span>Generation may take up to 3 minutes for complex applications</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  )}
                  
                  {/* Message timestamp */}
                  <div className="mt-2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg border border-white/10 flex-shrink-0">
                  <i className="ri-user-line text-slate-300 text-sm sm:text-lg"></i>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Premium Input Section - Mobile Optimized */}
      <div className="relative p-3 sm:p-6 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        
        <div className="relative space-y-3 sm:space-y-4">
          {/* Advanced Input Container with Embedded Controls */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl group-focus-within:border-blue-400/30 group-focus-within:shadow-blue-500/20 transition-all duration-300">
              <div className="p-3 sm:p-4 pb-14 sm:pb-16">
                <textarea 
                  className="w-full bg-transparent text-white placeholder-slate-400 resize-none focus:outline-none text-sm leading-relaxed"
                  placeholder={
                    errorFixMode
                      ? "🐛 Debug Mode: Paste your error message here and I'll fix it automatically..."
                      : directMode 
                        ? "💬 Chat Mode: Ask me anything about your code..."
                        : "🚀 Code Mode: Describe the app you want to build... (e.g., 'Create a modern todo list with dark mode and animations')"
                  }
                  rows={3}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    
                    // Auto-detect error messages
                    if (!errorFixMode && e.target.value && looksLikeError(e.target.value)) {
                      // If text looks like an error message, suggest error fix mode
                      toast({
                        title: "Error Detected",
                        description: "This looks like an error message. Switch to Debug Mode to fix it automatically.",
                        duration: 5000,
                      });
                    }
                  }}
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    // Submit on Ctrl+Enter or Cmd+Enter
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      if (!input.trim() || isGenerating) return;
                      
                      if (errorFixMode) {
                        handleErrorFix();
                      } else if (directMode) {
                        askClaude(input);
                      } else {
                        handleUserMessage(input);
                      }
                      setInput('');
                    }
                  }}
                />
                
                {/* Bottom Controls Container */}
                <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
                  {/* Left Side: Mode Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Code Mode Toggle */}
                    <button
                      onClick={() => {
                        // Switch to code mode (default mode)
                        setErrorFixMode(false);
                        setDirectMode(false);
                        setInput('');
                      }}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-all ${
                        !errorFixMode && !directMode
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30' 
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-purple-400'
                      }`}
                    >
                      <i className="ri-code-line"></i>
                      <span className="hidden sm:inline">Code</span>
                    </button>
                    
                    {/* Chat Mode Toggle */}
                    <button
                      onClick={() => {
                        // Switch to chat mode
                        setDirectMode(true);
                        setErrorFixMode(false);
                      }}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-all ${
                        directMode 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-blue-400'
                      }`}
                    >
                      <i className="ri-chat-3-line"></i>
                      <span className="hidden sm:inline">Chat</span>
                    </button>

                    {/* Debug Mode Toggle */}
                    <button
                      onClick={() => {
                        // Switch to debug mode
                        setErrorFixMode(true);
                        setDirectMode(false);
                        setInput('');
                      }}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-all ${
                        errorFixMode 
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30' 
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-orange-400'
                      }`}
                    >
                      <i className="ri-bug-line"></i>
                      <span className="hidden sm:inline">Debug</span>
                    </button>
                  </div>
                  
                  {/* Center: Upload Controls */}
                  <div className="flex items-center">
                    {/* File Upload */}
                    <button
                      onClick={handleFileUpload}
                      className="p-1 sm:p-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                      title="Upload File"
                    >
                      <i className="ri-file-line text-sm"></i>
                    </button>
                    
                    {/* Image Upload */}
                    <button
                      onClick={handleImageUpload}
                      className="p-1 sm:p-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                      title="Upload Image"
                    >
                      <i className="ri-image-line text-sm"></i>
                    </button>
                    
                    {/* URL Addition */}
                    <button
                      onClick={handleUrlUpload}
                      className="p-1 sm:p-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                      title="Add URL"
                    >
                      <i className="ri-links-line text-sm"></i>
                    </button>
                    
                    {/* Figma Upload */}
                    <button
                      onClick={handleFigmaUpload}
                      className="p-1 sm:p-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                      title="Import Figma"
                    >
                      <i className="ri-artboard-line text-sm"></i>
                    </button>
                  </div>
                  
                  {/* Right Side: Send Button */}
                  <button 
                    type="button"
                    className={`p-2 transition-all duration-200 ${
                      isGenerating 
                        ? 'text-slate-500 cursor-not-allowed' 
                        : !input.trim()
                          ? 'text-slate-500 cursor-not-allowed'
                          : 'text-blue-400 hover:text-blue-300 hover:scale-110'
                    }`}
                    disabled={isGenerating || !input.trim()}
                    title="Send message"
                    onClick={() => {
                      if (!input.trim() || isGenerating) return;
                      
                      if (errorFixMode) {
                        handleErrorFix();
                      } else if (directMode) {
                        askClaude(input);
                      } else {
                        handleUserMessage(input);
                      }
                      setInput('');
                    }}
                  >
                    {isGenerating ? (
                      <i className="ri-loader-4-line animate-spin text-lg"></i>
                    ) : (
                      <i className="ri-send-plane-fill text-lg"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Active Mode Display - Below Text Box */}
          <div className="text-center">
            <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border ${
              errorFixMode 
                ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-400/20' 
                : directMode 
                  ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-400/20' 
                  : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                errorFixMode 
                  ? 'bg-orange-400' 
                  : directMode 
                    ? 'bg-blue-400' 
                    : 'bg-purple-400'
              }`}></div>
              <i className={`text-xs ${
                errorFixMode 
                  ? 'ri-bug-line text-orange-400' 
                  : directMode 
                    ? 'ri-chat-3-line text-blue-400' 
                    : 'ri-code-line text-purple-400'
              }`}></i>
              <span className="text-xs font-medium text-slate-300">
                {errorFixMode ? 'Debugging Active' : directMode ? 'Chatting Active' : 'Coding Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPanel;

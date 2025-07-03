import { useState, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useWeblisite } from '../context/WeblisiteContext';
import { FolderStructure } from '../types';
import * as monaco from 'monaco-editor';
import { useToast } from "@/hooks/use-toast";

const EditorFileExplorer = () => {
  const { 
    files, 
    selectedFile, 
    setSelectedFile, 
    fileContent, 
    setFileContent,
    saveFile,
    currentGeneratingFile,
    setEditorInstance
  } = useWeblisite();
  
  const [folderStructure, setFolderStructure] = useState<FolderStructure[]>([]);
  const [isMobileFileExplorerOpen, setIsMobileFileExplorerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { toast } = useToast();
  
  // Transform flat file list into a nested structure for the explorer
  useEffect(() => {
    const buildFolderStructure = () => {
      const structure: Record<string, FolderStructure> = {};
      
      // First, create all folders
      files.forEach(file => {
        const parts = file.path.split('/');
        let currentPath = '';
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          const parentPath = currentPath;
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          
          if (!structure[currentPath]) {
            structure[currentPath] = {
              name: part,
              path: currentPath,
              isFolder: true,
              children: []
            };
            
            // Add to parent if exists
            if (parentPath && structure[parentPath]) {
              structure[parentPath].children.push(structure[currentPath]);
            }
          }
        }
      });
      
      // Then add all files
      files.forEach(file => {
        const parts = file.path.split('/');
        const fileName = parts[parts.length - 1];
        const parentPath = parts.slice(0, -1).join('/');
        
        const fileNode: FolderStructure = {
          name: fileName,
          path: file.path,
          isFolder: false,
          children: []
        };
        
        if (parentPath && structure[parentPath]) {
          structure[parentPath].children.push(fileNode);
        } else {
          // Root level file
          if (!structure[file.path]) {
            structure[file.path] = fileNode;
          }
        }
      });
      
      // Get only root level items
      return Object.values(structure).filter(item => {
        const parts = item.path.split('/');
        return parts.length === 1;
      });
    };
    
    setFolderStructure(buildFolderStructure());
  }, [files]);

  const handleFileClick = async (file: FolderStructure) => {
    if (file.isFolder) return;
    
    // Find the file in our flat list
    const selectedFileObj = files.find(f => f.path === file.path);
    if (!selectedFileObj) return;
    
    // Load file content
    try {
      const response = await fetch(`/api/file?path=${encodeURIComponent(file.path)}`);
      const data = await response.json();
      
      setSelectedFile(selectedFileObj);
      setFileContent(data.content);
    } catch (error) {
      console.error('Failed to fetch file content:', error);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileContent(value);
    }
  };
  
  // Download project as zip
  const handleDownloadProject = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/download-project', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download project');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') 
        : `project-${Date.now()}.zip`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Complete",
        description: "Your project has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Failed to download project:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the project.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Premium File Tree Item Component
  const FileTreeItem = ({ item }: { item: FolderStructure }) => {
    const isCurrentFile = selectedFile?.path === item.path;
    const isGenerating = currentGeneratingFile === item.path;
    
    const getFileIcon = (fileName: string, isFolder: boolean) => {
      if (isFolder) return { icon: 'ri-folder-3-fill', color: 'text-blue-400' };
      if (fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) 
        return { icon: 'ri-reactjs-line', color: 'text-cyan-400' };
      if (fileName.endsWith('.js') || fileName.endsWith('.ts')) 
        return { icon: 'ri-javascript-line', color: 'text-yellow-400' };
      if (fileName.endsWith('.css')) 
        return { icon: 'ri-css3-line', color: 'text-blue-500' };
      if (fileName.endsWith('.html')) 
        return { icon: 'ri-html5-line', color: 'text-orange-400' };
      if (fileName.endsWith('.json')) 
        return { icon: 'ri-brackets-line', color: 'text-green-400' };
      return { icon: 'ri-file-text-line', color: 'text-slate-400' };
    };
    
    const { icon, color } = getFileIcon(item.name, item.isFolder);
    
    return (
      <div>
        <div 
          className={`group relative flex items-center py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 ${
            isCurrentFile 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 shadow-lg' 
              : 'hover:bg-white/5 hover:shadow-md'
          }`}
          onClick={() => !item.isFolder && handleFileClick(item)}
        >
          {/* File/Folder Icon */}
          <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3 ${color}`}>
            <i className={`${icon} ${isGenerating ? 'animate-spin' : ''}`}></i>
          </div>
          
          {/* File Name */}
          <span className={`text-sm font-medium flex-1 ${
            isCurrentFile 
              ? 'text-white' 
              : 'text-slate-300 group-hover:text-white'
          } ${isGenerating ? 'animate-pulse' : ''}`}>
            {item.name}
          </span>
          
          {/* Status Indicators */}
          {isCurrentFile && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          )}
          {isGenerating && !isCurrentFile && (
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          )}
        </div>
        
        {/* Nested Items */}
        {item.isFolder && item.children.length > 0 && (
          <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4">
            {item.children.map((child, index) => (
              <FileTreeItem key={index} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get language from file extension
  const getLanguage = (fileName: string) => {
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'javascript';
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'typescript';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.json')) return 'json';
    return 'javascript';
  };

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Mobile File Explorer Overlay */}
      {isMobileFileExplorerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFileExplorerOpen(false)}>
          <div className="w-80 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">File Explorer</h2>
              <button 
                onClick={() => setIsMobileFileExplorerOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-white"></i>
              </button>
            </div>
            <div className="h-full overflow-y-auto p-4 premium-scrollbar">
              <div className="space-y-1">
                {folderStructure.map((item, index) => (
                  <div key={index} onClick={() => setIsMobileFileExplorerOpen(false)}>
                    <FileTreeItem item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Premium File Explorer - Desktop only */}
      <div className="hidden lg:block lg:w-1/4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 via-slate-800/20 to-slate-900/40 backdrop-blur-lg border-r border-white/10"></div>
        <div className="relative h-full overflow-y-auto p-2 lg:p-4 premium-scrollbar">
          {/* Explorer Header */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <i className="ri-folder-3-line text-blue-400 text-lg"></i>
              </div>
              <h3 className="text-sm font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Project Explorer
              </h3>
            </div>
            
            {/* Download Button */}
            <button
              onClick={handleDownloadProject}
              disabled={isDownloading || files.length === 0}
              className="w-full mb-3 px-3 py-1.5 bg-slate-700/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 border border-white/10 hover:border-blue-500/30 disabled:from-slate-600 disabled:to-slate-700 disabled:border-slate-600/30 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
              title="Download project as ZIP file"
            >
              {isDownloading ? (
                <>
                  <i className="ri-loader-4-line mr-1 animate-spin"></i>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <i className="ri-download-2-line mr-1"></i>
                  <span>Download Project</span>
                </>
              )}
            </button>

            <div className="text-xs text-slate-400">
              {files.length} files • {folderStructure.length} directories
            </div>
          </div>
          
          {/* File Tree */}
          <div className="space-y-1">
            {folderStructure.map((item, index) => (
              <FileTreeItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Premium Code Editor */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/60 backdrop-blur-sm"></div>
        
        <div className="relative flex flex-col h-full">
          {selectedFile ? (
            <>
              {/* Premium Editor Header - Mobile Optimized */}
              <div className="p-2 sm:p-4 border-b border-white/10 bg-slate-800/40 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    {/* Mobile File Explorer Toggle */}
                    <button 
                      className="lg:hidden mr-3 p-2 bg-slate-700/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 border border-white/20 hover:border-blue-500/30 rounded-lg text-slate-300 hover:text-white transition-all duration-200"
                      onClick={() => setIsMobileFileExplorerOpen(true)}
                    >
                      <i className="ri-folder-line text-sm"></i>
                    </button>
                    
                    <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <i className={`${selectedFile.name.endsWith('jsx') || selectedFile.name.endsWith('tsx') ? 'ri-reactjs-line' : 'ri-file-code-line'} text-blue-400 text-sm sm:text-lg`}></i>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{selectedFile.name}</h3>
                      <p className="text-xs text-slate-400 truncate hidden sm:block">{selectedFile.path}</p>
                    </div>
                  </div>
                  
                  {/* Premium Action Buttons - Mobile Optimized */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button 
                      className="px-2 sm:px-3 py-1.5 bg-slate-700/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 border border-white/10 hover:border-blue-500/30 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                      onClick={saveFile}
                      title="Save current file (Ctrl+S)"
                    >
                      <i className="ri-save-line sm:mr-1"></i>
                      <span className="hidden sm:inline">Save</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Premium Monaco Editor */}
              <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm rounded-xl m-2 border border-white/5 shadow-2xl">
                  <Editor
                    height="100%"
                    defaultLanguage={getLanguage(selectedFile.name)}
                    theme="vs-dark"
                    value={fileContent}
                    onChange={handleEditorChange}
                    onMount={(editor) => {
                      editorRef.current = editor;
                      setEditorInstance(editor);
                      
                      // Add Ctrl+S keyboard shortcut for manual save
                      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                        if (selectedFile) {
                          console.log(`Manual save triggered with Ctrl+S for ${selectedFile.path}`);
                          saveFile();
                          // Prevent the browser's default save dialog
                          return null;
                        }
                      });
                    }}
                    options={{
                      minimap: { enabled: true },
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontSize: 14,
                      lineHeight: 22,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: "on",
                      smoothScrolling: true,
                      fontLigatures: "on",
                      renderLineHighlight: 'gutter',
                      selectionHighlight: false,
                      roundedSelection: false,
                      padding: { top: 20, bottom: 20 },
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            // Premium Empty State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-file-code-line text-6xl text-slate-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No File Selected</h3>
                <p className="text-slate-400 max-w-sm">
                  Choose a file from the project explorer to start editing your code with our advanced editor.
                </p>
                <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 bg-slate-700/50 rounded mr-1">⌘</kbd>
                    <kbd className="px-2 py-1 bg-slate-700/50 rounded mr-1">S</kbd>
                    to save
                  </span>
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 bg-slate-700/50 rounded mr-1">⌘</kbd>
                    <kbd className="px-2 py-1 bg-slate-700/50 rounded mr-1">F</kbd>
                    to search
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorFileExplorer;

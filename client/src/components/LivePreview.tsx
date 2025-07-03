import { useWeblisite } from '../context/WeblisiteContext';
import { useEffect, useState, useRef } from 'react';

/**
 * LivePreview component that renders a preview of the current code
 * using an iframe that loads content from the preview API
 */
const LivePreview = () => {
  const { files } = useWeblisite();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Refresh preview when files change
  useEffect(() => {
    if (files.length > 0) {
      setRefreshKey(prev => prev + 1);
    }
  }, [files]);
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load preview');
  };
  
  // Refresh preview manually
  const refreshPreview = () => {
    setIsLoading(true);
    setError(null);
    setRefreshKey(prev => prev + 1);
  };
  
  // Premium Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center animate-pulse">
            <i className="ri-code-s-line text-blue-400 text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-white">Loading Preview</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Preparing your live preview...
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <i className="ri-error-warning-line text-red-400 text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-white">Preview Error</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={refreshPreview}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
          >
            <i className="ri-refresh-line mr-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-slate-400 font-mono">Live Preview</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshPreview}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            title="Refresh Preview"
          >
            <i className="ri-refresh-line text-sm"></i>
          </button>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 relative bg-white">
        <iframe
          ref={iframeRef}
          key={refreshKey}
          src={`/api/preview?t=${refreshKey}`}
          className="w-full h-full border-0"
          title="Live Preview"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      </div>
    </div>
  );
};

export default LivePreview;
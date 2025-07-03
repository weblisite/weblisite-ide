import { useState } from 'react';
import { useWeblisite } from '../context/WeblisiteContext';
import { saveSupabaseConfig, createSupabaseClientFile } from '../lib/SupabaseService';
import { useToast } from "@/hooks/use-toast";

const DatabaseConfig = () => {
  const { setIsDbModalOpen, supabaseConfig, setSupabaseConfig } = useWeblisite();
  const [url, setUrl] = useState(supabaseConfig?.url || '');
  const [key, setKey] = useState(supabaseConfig?.key || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !key) {
      toast({
        title: "Validation Error",
        description: "Both Supabase URL and Anon Key are required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const config = { url, key };
      
      // Save config to the backend
      await saveSupabaseConfig(config);
      
      // Create the supabase.js file in the project
      await createSupabaseClientFile(config);
      
      // Update context
      setSupabaseConfig(config);
      
      toast({
        title: "Database Connected",
        description: "Supabase configuration has been saved successfully.",
      });
      
      // Close modal
      setIsDbModalOpen(false);
    } catch (error) {
      console.error('Failed to save Supabase config:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to save Supabase configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDbModalOpen(false)} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl">
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            {/* Background effects matching main app */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-t-xl"></div>
            <div className="relative flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  💾 Connect Database
                </h3>
                <p className="text-slate-400 mt-1 text-sm">Configure your Supabase connection</p>
              </div>
              <button 
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1 rounded-lg transition-colors"
                onClick={() => setIsDbModalOpen(false)}
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative p-6">
            {/* Background gradient matching main app */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
            <div className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Supabase URL</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                    placeholder="https://your-project.supabase.co" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Supabase Anon Key</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                    placeholder="your-anon-key" 
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </div>
                
                {/* Info panel */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-200">
                      <p className="font-medium mb-1">Supabase Setup</p>
                      <p>You can find these values in your Supabase project settings under API configuration.</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isSubmitting 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25'
                  } text-white border-2 border-blue-400/50`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"></span>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Configuration'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConfig;

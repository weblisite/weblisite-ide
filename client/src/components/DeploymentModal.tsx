import { useState, useEffect } from 'react';
import { useWeblisite } from '../context/WeblisiteContext';
import { useToast } from '@/hooks/use-toast';
import NetlifyModal from './NetlifyModal';

const DeploymentModal = () => {
  const { 
    setIsDeployModalOpen, 
    setIsGitHubModalOpen,
    isNetlifyModalOpen,
    setIsNetlifyModalOpen,
    githubAccessToken,
    githubUser,
    lastPushedRepo,
    netlifyAccessToken,
    setNetlifyAccessToken,
    netlifyUser,
    setNetlifyUser,
    isNetlifyConnected,
    setIsNetlifyConnected
  } = useWeblisite();
  const { toast } = useToast();
  
  // Deployment flow state
  const [deploymentStep, setDeploymentStep] = useState<'check' | 'github' | 'netlify' | 'deploying' | 'success' | 'error'>('check');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // GitHub state
  const [hasFiles, setHasFiles] = useState(false);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  
  // Netlify deployment state
  const [siteName, setSiteName] = useState('');
  const [deployedSite, setDeployedSite] = useState<any>(null);
  const [deploymentProgress, setDeploymentProgress] = useState<string>('');

  // Check deployment prerequisites on modal open
  useEffect(() => {
    checkDeploymentPrerequisites();
  }, [githubAccessToken, lastPushedRepo, netlifyAccessToken]);

  useEffect(() => {
    // Check Netlify connection status
    checkNetlifyConnection();
  }, [netlifyAccessToken]);

  const checkNetlifyConnection = () => {
    if (netlifyAccessToken) {
      setIsNetlifyConnected(true);
    } else {
      // Check localStorage for stored token
      const storedToken = localStorage.getItem('netlify_access_token');
      const storedUser = localStorage.getItem('netlify_user');
      
      if (storedToken && storedUser) {
        setNetlifyAccessToken(storedToken);
        setNetlifyUser(JSON.parse(storedUser));
        setIsNetlifyConnected(true);
      } else {
        setIsNetlifyConnected(false);
      }
    }
  };

  const checkDeploymentPrerequisites = async () => {
    setIsLoading(true);
    
    try {
      // Check if files exist
      const filesResponse = await fetch('/api/files');
      const filesData = await filesResponse.json();
      setHasFiles(filesData && filesData.length > 0);
      
      // Check GitHub connection
      setIsGitHubConnected(!!githubAccessToken && !!githubUser);
      
      // Determine which step to show
      if (!hasFiles) {
        setDeploymentStep('error');
        setErrorMessage('No files found. Please generate your app first.');
      } else if (!isGitHubConnected || !lastPushedRepo) {
        setDeploymentStep('github');
      } else {
        setDeploymentStep('netlify');
      }
    } catch (error) {
      console.error('Error checking deployment prerequisites:', error);
      setDeploymentStep('error');
      setErrorMessage('Failed to check deployment prerequisites.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGitHub = () => {
    setIsDeployModalOpen(false);
    setIsGitHubModalOpen(true);
  };

  const handleOpenNetlify = () => {
    setIsNetlifyModalOpen(true);
  };

  const handleNetlifyConnect = (accessToken: string, user: any) => {
    setNetlifyAccessToken(accessToken);
    setNetlifyUser(user);
    setIsNetlifyConnected(true);
    
    toast({
      title: "Netlify Connected!",
      description: `Welcome, ${user.name}! You can now deploy to your Netlify account.`,
    });
  };

  const handleDeployToNetlify = async () => {
    if (!lastPushedRepo) {
      toast({
        title: "Deployment Error",
        description: "GitHub repository missing. Please push to GitHub first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setDeploymentStep('deploying');
    setDeploymentProgress('Preparing deployment...');

    try {
      // Generate site name if not provided
      const finalSiteName = siteName || `${lastPushedRepo.name}-${Date.now()}`;

      // Deploy from GitHub to Netlify
      const deployResponse = await fetch('/api/netlify/deploy-from-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          netlifyAccessToken: netlifyAccessToken, // Use the authenticated token
          githubRepoUrl: lastPushedRepo.url,
          siteName: finalSiteName,
          buildCommand: 'npm run build',
          publishDirectory: 'dist',
          branch: 'main'
        })
      });

      if (!deployResponse.ok) {
        const errorData = await deployResponse.json();
        throw new Error(errorData.message || 'Failed to deploy to Netlify');
      }

      const data = await deployResponse.json();
      
      if (data.manual) {
        // Manual deployment instructions
        setDeployedSite({
          manual: true,
          instructions: data.instructions,
          netlifyToml: data.netlifyToml,
          connectUrl: data.connectUrl,
          repoName: lastPushedRepo.name
        });
        setDeploymentProgress('Manual deployment instructions ready');
      } else {
        // Automatic deployment succeeded
        setDeployedSite(data.site);
        setDeploymentProgress('Deployment initiated! Building your app...');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      setDeploymentStep('success');
      
      toast({
        title: data.manual ? "Deployment Instructions Ready! 📋" : "Deployment Successful! 🚀",
        description: data.manual ? "Follow the instructions to deploy manually" : "Your app is being built and will be live shortly.",
      });

    } catch (error: any) {
      console.error('Netlify deployment error:', error);
      setDeploymentStep('error');
      setErrorMessage(error.message);
      
      toast({
        title: "Deployment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading && deploymentStep === 'check') {
      return (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Checking deployment prerequisites...</p>
        </div>
      );
    }

    switch (deploymentStep) {
      case 'github':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Push to GitHub First</h3>
              <p className="text-slate-400 mb-6">
                To deploy to production, you need to push your code to GitHub first. This enables automatic deployments and version control.
              </p>
            </div>

            <button 
              onClick={handleOpenGitHub}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-2 border-blue-400/50 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-white font-semibold rounded-xl"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Push to GitHub
            </button>
          </div>
        );

      case 'netlify':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Deploy!</h3>
              <p className="text-slate-400 mb-6">
                GitHub: {lastPushedRepo?.name} • Your app will be deployed to Netlify
              </p>
            </div>

            {/* Netlify Authentication Check */}
            {!isNetlifyConnected ? (
              <div className="space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-orange-200 font-medium">Connect Netlify Account</p>
                      <p className="text-orange-300 text-sm">You need to connect your Netlify account to deploy to your own sites.</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleOpenNetlify}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-2 border-teal-400/50 shadow-lg hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105 text-white font-semibold rounded-xl"
                >
                  <svg className="w-5 h-5 mr-2 inline-block" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.23l2.349 2.352a1.044 1.044 0 0 1 .232.303c.055.113.085.239.085.369s-.03.256-.085.369a1.044 1.044 0 0 1-.232.303l-2.349 2.352a1.044 1.044 0 0 1-.303.23c-.113.055-.239.085-.369.085s-.256-.03-.369-.085a1.044 1.044 0 0 1-.303-.23L14.548 13.45a1.044 1.044 0 0 1-.23-.303c-.055-.113-.085-.239-.085-.369s.03-.256.085-.369c.055-.113.127-.213.23-.303l1.345-1.347a1.044 1.044 0 0 1 .303-.23c.113-.055.239-.085.369-.085s.256.03.369.085zm-9.85 0a1.044 1.044 0 0 1 .369-.085c.13 0 .256.03.369.085a1.044 1.044 0 0 1 .303.23l1.345 1.347c.103.09.175.19.23.303.055.113.085.239.085.369s-.03.256-.085.369a1.044 1.044 0 0 1-.23.303L7.084 13.45a1.044 1.044 0 0 1-.303.23c-.113.055-.239.085-.369.085s-.256-.03-.369-.085a1.044 1.044 0 0 1-.303-.23L3.391 11.098a1.044 1.044 0 0 1-.232-.303c-.055-.113-.085-.239-.085-.369s.03-.256.085-.369a1.044 1.044 0 0 1 .232-.303L5.74 8.749a1.044 1.044 0 0 1 .303-.23c.113-.055.239-.085.369-.085s.256.03.369.085z"/>
                  </svg>
                  Connect Netlify Account
                </button>
                
                <div className="text-xs text-slate-500 text-center">
                  Free deployment to your own Netlify account with automatic GitHub integration
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-green-200 font-medium">Netlify Connected</p>
                      <p className="text-green-300 text-sm">Deploying to {netlifyUser?.name}'s account</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Site Name (optional)
                  </label>
                  <input
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder={`${lastPushedRepo?.name}-${Date.now()}`}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-3 py-2 rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Will be: {siteName || `${lastPushedRepo?.name}-${Date.now()}`}.netlify.app
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-sm">
                    <p className="text-blue-200 mb-2">
                      <strong>What happens next:</strong>
                    </p>
                    <ul className="text-blue-200 space-y-1 list-disc list-inside">
                      <li>Netlify will connect to your GitHub repository</li>
                      <li>Your app will be built automatically (npm run build)</li>
                      <li>Live on a secure .netlify.app domain with HTTPS</li>
                      <li>Auto-deploys when you push updates to GitHub</li>
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={handleDeployToNetlify}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-2 border-blue-400/50 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                      Creating Site...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      🚀 Deploy to Netlify
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );

      case 'deploying':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Deploying Your App</h3>
            <p className="text-slate-400 mb-4">{deploymentProgress}</p>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <div className="text-sm text-slate-300">
                This usually takes 1-3 minutes. Netlify is:
                <ul className="mt-2 space-y-1 list-disc list-inside text-slate-400">
                  <li>Downloading your code from GitHub</li>
                  <li>Installing dependencies (npm install)</li>
                  <li>Building your app (npm run build)</li>
                  <li>Deploying to global CDN</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">🚀 Deployment Successful!</h3>
            <p className="text-slate-400 mb-6">Your app is now live on the internet!</p>
            
            {deployedSite && (
              <div className="space-y-4">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Live URL:</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input 
                          type="text" 
                          value={deployedSite.url} 
                          readOnly 
                          className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-3 py-2 rounded text-sm"
                        />
                        <button
                          onClick={() => window.open(deployedSite.url, '_blank')}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded font-medium"
                        >
                          Visit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Deployment Error</h3>
            <p className="text-slate-400 mb-6">{errorMessage}</p>
            
            <div className="space-y-3">
              <button 
                onClick={checkDeploymentPrerequisites}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-2 border-blue-400/50 text-white font-semibold py-2 px-4 rounded-xl"
              >
                Try Again
              </button>
              
              {!hasFiles && (
                <p className="text-sm text-slate-500">
                  💡 Generate your app first by chatting with the AI assistant
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDeployModalOpen(false)} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            {/* Background effects matching main app */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-t-xl"></div>
            <div className="relative flex justify-between items-center">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🚀 Deploy to Production
              </h3>
              <button 
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1 rounded-lg transition-colors"
                onClick={() => setIsDeployModalOpen(false)}
                disabled={isLoading && deploymentStep === 'deploying'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative p-6">
            {/* Background gradient matching main app */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
            <div className="relative">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Netlify Modal */}
      <NetlifyModal
        isOpen={isNetlifyModalOpen}
        onClose={() => setIsNetlifyModalOpen(false)}
        onNetlifyConnect={handleNetlifyConnect}
      />
    </div>
  );
};

export default DeploymentModal; 
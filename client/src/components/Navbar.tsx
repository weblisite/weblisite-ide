import { useWeblisite } from '../context/WeblisiteContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'wouter';
import GitHubModal from './GitHubModal';
import UserProfile from './UserProfile';

interface NavbarProps {
  // No props needed anymore
}

const Navbar = () => {
  const { files, setIsDbModalOpen, setIsDeployModalOpen, isGitHubModalOpen, setIsGitHubModalOpen, isUserProfileOpen, setIsUserProfileOpen } = useWeblisite();
  const { user, signOut, loading, userProfile } = useAuth();
  
  const handleGitHubSuccess = (repositoryUrl: string, commitUrl: string) => {
    // GitHub success is handled in the modal itself
    setIsGitHubModalOpen(false);
  };
  
  // Check if user has generated files
  const hasGeneratedFiles = files.length > 0;
  
  const getUserDisplayName = () => {
    if (userProfile?.full_name && userProfile.full_name.trim()) {
      // Return first name only
      return userProfile.full_name.split(' ')[0];
    }
    // Fallback to email prefix but make it look more like a name
    const emailPrefix = user?.email?.split('@')[0] || 'User';
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  };
  
  return (
    <>
      <nav className="relative z-20 backdrop-blur-2xl bg-slate-900/80 border-b border-white/10 shadow-2xl">
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Premium Logo Section - Mobile Optimized */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg">
                <i className="ri-code-box-line text-white text-lg sm:text-xl"></i>
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Weblisite
              </h1>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">AI-Powered Development</p>
            </div>
          </div>

          {/* Premium Action Buttons - Mobile Optimized */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Database Connection Button - Mobile Optimized */}
            <button 
              className="group relative flex items-center px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-800/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 border border-white/10 hover:border-blue-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
              onClick={() => setIsDbModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              <i className="ri-database-2-line sm:mr-2 text-slate-300 group-hover:text-white transition-colors"></i>
              <span className="relative hidden sm:inline">Connect Database</span>
              <span className="relative sm:hidden ml-1">DB</span>
            </button>

            {/* GitHub Push Button - Conditional on having generated files */}
            <button 
              className={`group relative flex items-center px-3 sm:px-5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg ${
                hasGeneratedFiles 
                  ? 'bg-slate-800/60 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-800 border-white/10 hover:border-gray-500/30 hover:shadow-xl hover:shadow-gray-500/25 hover:scale-105 cursor-pointer' 
                  : 'bg-slate-800/40 border-slate-600/30 cursor-not-allowed opacity-50'
              }`}
              onClick={() => hasGeneratedFiles && setIsGitHubModalOpen(true)}
              disabled={!hasGeneratedFiles}
              title={hasGeneratedFiles ? 'Push your generated code to GitHub' : 'Generate code first to enable GitHub push'}
            >
              {hasGeneratedFiles && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              )}
              <svg className={`w-4 h-4 sm:mr-2 transition-colors ${
                hasGeneratedFiles 
                  ? 'text-slate-300 group-hover:text-white' 
                  : 'text-slate-500'
              }`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className={`relative hidden sm:inline transition-colors ${
                hasGeneratedFiles 
                  ? 'text-slate-300 group-hover:text-white' 
                  : 'text-slate-500'
              }`}>
                {hasGeneratedFiles ? 'Push to GitHub' : 'Generate Code First'}
              </span>
              <span className={`relative sm:hidden ml-1 transition-colors ${
                hasGeneratedFiles 
                  ? 'text-slate-300 group-hover:text-white' 
                  : 'text-slate-500'
              }`}>GitHub</span>
              {hasGeneratedFiles && (
                <>
                  <div className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
                </>
              )}
            </button>

            {/* Deploy Button - Premium CTA - Mobile Optimized */}
            <button 
              className="group relative flex items-center px-3 sm:px-6 py-2 sm:py-2.5 bg-slate-800/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 border border-white/10 hover:border-blue-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              onClick={() => setIsDeployModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              <i className="ri-rocket-line sm:mr-2 relative text-slate-300 group-hover:text-white transition-colors"></i>
              <span className="relative hidden sm:inline text-slate-300 group-hover:text-white transition-colors">Deploy to Production</span>
              <span className="relative sm:hidden ml-1 text-slate-300 group-hover:text-white transition-colors">Deploy</span>
              <div className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-orange-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-orange-500 rounded-full"></div>
            </button>

            {/* Authentication Section */}
            {user ? (
              /* User Profile Button - Authenticated */
              <div className="flex items-center space-x-2">
                {userProfile?.plan && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                    userProfile.plan === 'pro' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    userProfile.plan === 'team' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {userProfile.plan.toUpperCase()}
                  </span>
                )}
                <button
                  onClick={() => setIsUserProfileOpen(true)}
                  className="group relative flex items-center px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-800/60 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 border border-white/10 hover:border-indigo-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  <i className="ri-user-line sm:mr-2 text-slate-300 group-hover:text-white transition-colors relative"></i>
                  <span className="relative text-slate-300 group-hover:text-white transition-colors">
                    {getUserDisplayName()}
                  </span>
                </button>
              </div>
            ) : (
              /* Authentication Buttons - Not Authenticated */
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <button className="group relative flex items-center px-2 sm:px-3 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 hover:border-blue-500/30 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm">
                    <i className="ri-user-line sm:mr-1 text-slate-300 group-hover:text-white transition-colors"></i>
                    <span className="hidden sm:inline text-slate-300 group-hover:text-white transition-colors">Sign In</span>
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="group relative flex items-center px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border border-blue-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                    <i className="ri-user-add-line sm:mr-2 relative text-white transition-colors"></i>
                    <span className="relative hidden sm:inline text-white transition-colors">Sign Up</span>
                    <span className="relative sm:hidden ml-1 text-white transition-colors">Join</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Subtle gradient border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </nav>

      {/* GitHub Modal */}
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSuccess={handleGitHubSuccess}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
      />
    </>
  );
};

export default Navbar;

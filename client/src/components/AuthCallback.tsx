import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabaseService } from '../lib/SupabaseService';

const AuthCallback = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The auth state change listener in AuthContext will handle the session
        // Just redirect to the builder after a brief delay
        setTimeout(() => {
          setLocation('/builder');
        }, 1000);
      } catch (error) {
        console.error('Auth callback error:', error);
        // Redirect to home on error
        setLocation('/');
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 
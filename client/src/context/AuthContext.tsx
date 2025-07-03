import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useLocation } from 'wouter';
import { supabaseService, UserProfile } from '../lib/SupabaseService';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  redirectToAuth: () => void;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Refs to store timeout IDs for OAuth sign-ins
  const googleSignInTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const githubSignInTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const session = await supabaseService.getSession();
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Load or create user profile
          try {
            let profile = await supabaseService.getUserProfile(session.user.id);
            
            // Create profile if it doesn't exist (for new users)
            if (!profile) {
              profile = await supabaseService.upsertUserProfile(session.user.id, {
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || '',
                username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
                password: 'supabase_auth_user', // Dummy value since we use Supabase Auth
                plan: 'free'
              });
            }
            
            setUserProfile(profile);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabaseService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Clear any pending OAuth timeouts since user is now authenticated
          if (googleSignInTimeoutRef.current) {
            clearTimeout(googleSignInTimeoutRef.current);
            googleSignInTimeoutRef.current = null;
          }
          if (githubSignInTimeoutRef.current) {
            clearTimeout(githubSignInTimeoutRef.current);
            githubSignInTimeoutRef.current = null;
          }

          // Load or create user profile
          try {
            let profile = await supabaseService.getUserProfile(session.user.id);
            
            // Create profile if it doesn't exist (for new users)
            if (!profile) {
              // Get user's name from multiple sources with priority
              const getUserName = () => {
                // 1. Check user_metadata.full_name (from manual signup)
                if (session.user.user_metadata?.full_name) {
                  return session.user.user_metadata.full_name;
                }
                // 2. Check user_metadata.name (from OAuth)
                if (session.user.user_metadata?.name) {
                  return session.user.user_metadata.name;
                }
                // 3. Check identities (GitHub, Google)
                if (session.user.identities && session.user.identities.length > 0) {
                  const identity = session.user.identities[0];
                  if (identity.identity_data?.full_name) {
                    return identity.identity_data.full_name;
                  }
                  if (identity.identity_data?.name) {
                    return identity.identity_data.name;
                  }
                }
                // 4. Fallback to email prefix
                return session.user.email?.split('@')[0] || 'User';
              };

              const fullName = getUserName();
              const username = session.user.email?.split('@')[0] || 'user';

              profile = await supabaseService.upsertUserProfile(session.user.id, {
                email: session.user.email!,
                full_name: fullName,
                username,
                password: 'supabase_auth_user', // Dummy password for Supabase Auth users
                avatar_url: session.user.user_metadata?.avatar_url || null,
                plan: 'free',
              });
            }
            
            setUserProfile(profile);
            
            // Show success toast for sign in
            if (event === 'SIGNED_IN') {
              toast({
                title: "Welcome Back!",
                description: "You have successfully signed in.",
              });
            }
            
            // Always reset loading state when user is authenticated
            setLoading(false);
            
            // Redirect to builder if we're on signin page or landing page
            const currentPath = window.location.pathname;
            console.log('Current path on auth:', currentPath);
            if (currentPath === '/signin' || currentPath === '/') {
              console.log('Redirecting to builder...');
              setTimeout(() => {
                setLocation('/builder');
              }, 100); // Shorter delay for better UX
            }
            
          } catch (error) {
            console.error('Error managing user profile:', error);
            setLoading(false);
          }
        } else {
          setUserProfile(null);
          // Always reset loading state when auth state changes
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const redirectToAuth = () => {
    // Redirect to Supabase hosted auth UI
    supabaseService.redirectToAuth();
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Set a timeout to ensure loading state is reset
      const loadingTimeout = setTimeout(() => {
        console.log('Google sign in timeout - resetting loading state');
        setLoading(false);
      }, 15000); // 15 second timeout for OAuth redirect

      await supabaseService.signInWithGoogle();
      
      // OAuth will redirect, so we'll clear timeout in auth state listener
      // But store timeout ID in case we need to clear it
      googleSignInTimeoutRef.current = loadingTimeout;
      
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google Sign In Failed",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      });
      setLoading(false);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      
      // Set a timeout to ensure loading state is reset
      const loadingTimeout = setTimeout(() => {
        console.log('GitHub sign in timeout - resetting loading state');
        setLoading(false);
      }, 15000); // 15 second timeout for OAuth redirect

      await supabaseService.signInWithGitHub();
      
      // OAuth will redirect, so we'll clear timeout in auth state listener
      // But store timeout ID in case we need to clear it
      githubSignInTimeoutRef.current = loadingTimeout;
      
    } catch (error: any) {
      console.error('GitHub sign in error:', error);
      toast({
        title: "GitHub Sign In Failed",
        description: error.message || "Failed to sign in with GitHub.",
        variant: "destructive",
      });
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🔓 Starting sign out process...');
    setLoading(true);
    
    // Clear local state immediately for instant feedback
    setUser(null);
    setSession(null);
    setUserProfile(null);
    
    // Show success toast immediately
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    
    // Redirect to landing page immediately
    setLocation('/');
    
    // Set loading to false immediately
    setLoading(false);
    
    // Try to sign out from Supabase in the background (with timeout)
    setTimeout(async () => {
      try {
        await Promise.race([
          supabaseService.signOut(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Sign out timeout')), 3000)
          )
        ]);
        console.log('✅ Supabase sign out completed');
      } catch (error) {
        console.log('⚠️ Supabase sign out failed or timed out (user already signed out locally):', error);
        // This is fine - user is already signed out from the UI perspective
      }
    }, 100);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedProfile = await supabaseService.updateUserProfile(user.id, profileData);
      setUserProfile(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Profile Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    redirectToAuth,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
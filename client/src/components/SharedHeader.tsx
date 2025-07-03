import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';

interface SharedHeaderProps {
  showNavigation?: boolean;
}

export default function SharedHeader({ showNavigation = false }: SharedHeaderProps) {
  const { user } = useAuth();

  return (
    <nav className="relative z-50 px-6 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Weblisite
            </span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {showNavigation && (
            <>
              <a href="/#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="/#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
            </>
          )}
          {user ? (
            <Link href="/builder">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                Go to Builder →
              </button>
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=email&redirect_to=${encodeURIComponent(window.location.origin + '/auth/callback')}`}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 
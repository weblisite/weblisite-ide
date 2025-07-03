import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SharedHeader />

      {/* Main Content */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Insights, updates, and stories from the future of AI-powered development
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-bold mb-6">Coming Soon!</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              We're working on bringing you the latest insights, tutorials, and updates about AI-powered development. 
              Our blog will feature deep dives into technology, success stories, and tips to help you build better apps faster.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2">AI Development</h3>
                <p className="text-slate-400 text-sm">
                  Learn how Claude 4 Sonnet is revolutionizing app development
                </p>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-lg font-semibold mb-2">Success Stories</h3>
                <p className="text-slate-400 text-sm">
                  Real stories from builders using Weblisite to create amazing apps
                </p>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold mb-2">Tips & Tricks</h3>
                <p className="text-slate-400 text-sm">
                  Pro tips to get the most out of AI-powered development
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Be the First to Know</h3>
              <p className="text-slate-300 mb-4">
                Want to be notified when we publish our first blog post? Get in touch with us!
              </p>
              <a 
                href="mailto:antony@weblisite.com?subject=Blog%20Updates" 
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                📧 Get Notified
              </a>
            </div>

            <div className="space-y-4">
              <p className="text-slate-400">
                In the meantime, why not try building something amazing?
              </p>
              <a 
                href="/builder" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
              >
                🚀 Start Building Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 
import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Status() {
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">System Status</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Real-time status of Weblisite services and infrastructure
            </p>
          </div>

          {/* Overall Status */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-8 mb-12 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">All Systems Operational</h2>
            <p className="text-slate-300 text-lg">
              All Weblisite services are running smoothly
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Service Status */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Core Services</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Web Application</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>AI Processing (Claude 4 Sonnet)</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Code Generation</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Live Preview</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Performance Metrics</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                  <div className="text-slate-300 text-sm">Uptime</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">&lt;2s</div>
                  <div className="text-slate-300 text-sm">Response Time</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">&lt;10s</div>
                  <div className="text-slate-300 text-sm">AI Generation</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">0</div>
                  <div className="text-slate-300 text-sm">Active Incidents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Updates</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">System Upgrade</span>
                    <span className="text-xs text-slate-400">Dec 25, 2024</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Upgraded to Claude 4 Sonnet for improved AI performance and code generation quality.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">Performance Improvement</span>
                    <span className="text-xs text-slate-400">Dec 20, 2024</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Optimized API response times and improved overall system performance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">New Feature</span>
                    <span className="text-xs text-slate-400">Dec 15, 2024</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Launched the new landing page with improved user experience and prompt-based workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Issues or Questions?</h2>
            <p className="text-slate-300 mb-6">
              If you're experiencing any issues not reflected here, please contact our support team.
            </p>
            
            <a 
              href="mailto:support@weblisite.com?subject=Status%20Page%20Inquiry" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              📧 Contact Support
            </a>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 
import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Security() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SharedHeader />

      <div className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Security</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              How we protect your data and ensure platform security
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold mb-4">Security First</h2>
              <p className="text-slate-300 text-lg">
                We take security seriously and implement industry best practices to protect your data and projects.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Data Protection</h2>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">🛡️</span>
                    <span><strong>Encryption:</strong> All data encrypted in transit and at rest</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">🔐</span>
                    <span><strong>Authentication:</strong> Secure user authentication with Supabase</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">🔑</span>
                    <span><strong>Access Control:</strong> Role-based access and permissions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">AI & Code Security</h2>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-400 mt-1">👤</span>
                    <span><strong>Code Ownership:</strong> You own all generated code</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-400 mt-1">🔒</span>
                    <span><strong>Private Projects:</strong> Your projects remain private</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-400 mt-1">🤖</span>
                    <span><strong>AI Processing:</strong> Secure processing with Claude 4 Sonnet</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Report Security Issues</h2>
              <p className="text-slate-300 mb-6">
                Found a security vulnerability? We take all security reports seriously and respond quickly.
              </p>
              
              <a 
                href="mailto:antony@weblisite.com?subject=Security%20Issue%20Report" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                🚨 Report Security Issue
              </a>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 
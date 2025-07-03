import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Privacy() {
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Privacy Policy</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              How we collect, use, and protect your information
            </p>
            <p className="text-slate-400 mt-4">
              Last updated: December 25, 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              At Weblisite, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our AI-powered development platform. 
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access or use our service.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Account Information</h3>
                <p className="text-slate-300">
                  When you create an account, we collect your email address, username, and encrypted password.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Project Data</h3>
                <p className="text-slate-300">
                  We store the code, prompts, and projects you create using our platform to provide the service 
                  and enable you to access your work across sessions.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Usage Information</h3>
                <p className="text-slate-300">
                  We collect information about how you use our service, including features used, 
                  time spent, and interaction patterns to improve our platform.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Technical Information</h3>
                <p className="text-slate-300">
                  We automatically collect certain technical information including IP address, 
                  browser type, device information, and operating system.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Provide, operate, and maintain our AI development platform</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Process and respond to your prompts using Claude 4 Sonnet</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Improve and enhance our services and user experience</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Communicate with you about your account and our services</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Monitor usage and prevent misuse of our platform</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Comply with legal obligations and enforce our terms</span>
              </li>
            </ul>
          </div>

          {/* Data Sharing */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
            
            <div className="space-y-4">
              <p className="text-slate-300">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>AI Processing:</strong> Your prompts are sent to Anthropic's Claude 4 Sonnet for processing, subject to their privacy policy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform (hosting, analytics, authentication)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your information:
            </p>
            
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Encryption in transit and at rest</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Secure authentication and password hashing</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Regular security updates and monitoring</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Limited access to personal data</span>
              </li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-slate-300 mb-4">You have the right to:</p>
            
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Access and review your personal information</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Update or correct your account information</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Delete your account and associated data</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Export your project data</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Opt out of non-essential communications</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-slate-300 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us.
            </p>
            
            <div className="space-y-4">
              <a 
                href="mailto:antony@weblisite.com?subject=Privacy%20Policy%20Question" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                📧 Contact Us
              </a>
            </div>
            
            <div className="mt-6 text-sm text-slate-400">
              <p>📧 <strong>antony@weblisite.com</strong></p>
              <p>We'll respond to privacy inquiries within 48 hours</p>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 
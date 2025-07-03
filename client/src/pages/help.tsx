import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Help() {
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Help Center</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to know about using Weblisite
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <a href="mailto:support@weblisite.com?subject=Technical%20Support" className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-slate-800/50 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🛠️</div>
              <h2 className="text-2xl font-bold mb-4">Technical Support</h2>
              <p className="text-slate-300 mb-4">
                Having technical issues? Our support team is here to help you get back to building.
              </p>
              <div className="text-blue-400 font-medium">Get Support →</div>
            </a>

            <a href="/contact" className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-slate-800/50 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">💬</div>
              <h2 className="text-2xl font-bold mb-4">General Questions</h2>
              <p className="text-slate-300 mb-4">
                Have questions about features, pricing, or how Weblisite works?
              </p>
              <div className="text-blue-400 font-medium">Contact Us →</div>
            </a>

            <a href="/#faq" className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-slate-800/50 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">❓</div>
              <h2 className="text-2xl font-bold mb-4">FAQ</h2>
              <p className="text-slate-300 mb-4">
                Quick answers to the most common questions about Weblisite.
              </p>
              <div className="text-blue-400 font-medium">View FAQ →</div>
            </a>
          </div>

          {/* Getting Started Guide */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Getting Started with Weblisite</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Describe Your App Idea</h3>
                    <p className="text-slate-300">
                      Start by describing what you want to build in the prompt box. Be as detailed as possible - 
                      the more specific you are, the better your app will be.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Choose Your Plan</h3>
                    <p className="text-slate-300">
                      Select from our Free (5 prompts/day), Starter (150 prompts/month), 
                      Pro (300 prompts/month), or Enterprise (500 prompts/month) plans.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sign In or Sign Up</h3>
                    <p className="text-slate-300">
                      Create your account or sign in to access the builder. Your prompt will be saved 
                      and automatically loaded in the builder.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Watch AI Build Your App</h3>
                    <p className="text-slate-300">
                      Claude 4 Sonnet will generate your complete application with all necessary files, 
                      components, and functionality based on your description.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">5</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Preview & Refine</h3>
                    <p className="text-slate-300">
                      See your app in the live preview panel. Make changes by chatting with AI or 
                      editing the code directly in the built-in editor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">6</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Deploy Instantly</h3>
                    <p className="text-slate-300">
                      When you're happy with your app, deploy it instantly to make it live on the web. 
                      Share your creation with the world!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Common Issues</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-blue-400">App not generating correctly?</h3>
                  <p className="text-slate-300 text-sm">
                    Try being more specific in your prompt. Include details about functionality, 
                    design preferences, and any specific features you need.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-blue-400">Preview not loading?</h3>
                  <p className="text-slate-300 text-sm">
                    Refresh the page and try again. If the issue persists, contact our support team.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-blue-400">Reached your prompt limit?</h3>
                  <p className="text-slate-300 text-sm">
                    Free users get 5 prompts per day. Upgrade to a paid plan for more prompts or wait until tomorrow.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Tips for Better Results</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">Be Specific</h3>
                  <p className="text-slate-300 text-sm">
                    Instead of "a social app", try "a social media app with user profiles, photo sharing, 
                    likes, comments, and a feed timeline".
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">Mention Key Features</h3>
                  <p className="text-slate-300 text-sm">
                    List the core functionality you need: user authentication, database storage, 
                    payment processing, etc.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">Include Design Preferences</h3>
                  <p className="text-slate-300 text-sm">
                    Mention if you want it modern, minimalist, colorful, professional, etc. 
                    This helps Claude style your app appropriately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed with Weblisite.
            </p>
            
            <div className="space-y-4">
              <a 
                href="mailto:support@weblisite.com" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 mr-4"
              >
                📧 Email Support
              </a>
              <a 
                href="/contact" 
                className="inline-block px-8 py-3 border border-white/20 hover:bg-white/10 rounded-lg font-medium transition-all duration-300"
              >
                Contact Form
              </a>
            </div>
            
            <div className="mt-6 text-sm text-slate-400">
              <p>📧 <strong>support@weblisite.com</strong></p>
              <p>We typically respond within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 
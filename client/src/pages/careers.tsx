import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function Careers() {
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Careers</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join us in building the future of AI-powered development
            </p>
          </div>

          {/* Main Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12 text-center mb-12">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold mb-6">We're Just Getting Started!</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Weblisite is in its early stages, and we're focused on building an incredible product. 
              While we don't have open positions right now, we're always interested in connecting with talented, 
              passionate people who share our vision.
            </p>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-4">Interested in Joining Our Mission?</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                We're looking for people who are excited about the intersection of AI and development, 
                who want to democratize software creation, and who thrive in fast-paced, innovative environments.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="text-left">
                  <h4 className="font-semibold mb-2 text-blue-400">Future Opportunities Might Include:</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• AI/ML Engineers</li>
                    <li>• Full-Stack Developers</li>
                    <li>• Product Designers</li>
                    <li>• DevOps Engineers</li>
                    <li>• Product Managers</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold mb-2 text-purple-400">What We Value:</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Innovation & creativity</li>
                    <li>• User-first thinking</li>
                    <li>• Technical excellence</li>
                    <li>• Collaborative spirit</li>
                    <li>• Growth mindset</li>
                  </ul>
                </div>
              </div>

              <a 
                href="mailto:careers@weblisite.com?subject=Interest%20in%20Future%20Opportunities" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                📧 Send Us Your Info
              </a>
            </div>
          </div>

          {/* Company Culture */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
              <p className="text-slate-300">
                We're building something that's never been done before. Every day brings new challenges and breakthroughs.
              </p>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Impact Driven</h3>
              <p className="text-slate-300">
                Your work will directly impact how millions of people build and deploy applications in the future.
              </p>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Fast Growth</h3>
              <p className="text-slate-300">
                Join us early and grow with the company. Shape the culture, processes, and product from the ground up.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
            <p className="text-slate-300 mb-6">
              Don't see a perfect fit right now? That's okay! Send us your resume and a note about what excites you. 
              We'll keep you in mind as we grow.
            </p>
            
            <div className="space-y-4">
              <p className="text-slate-400">
                📧 <strong>careers@weblisite.com</strong>
              </p>
              <p className="text-sm text-slate-500">
                Include your resume, a brief note about yourself, and what role you'd be interested in.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 
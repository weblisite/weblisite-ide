import React from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';

export default function About() {
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
              About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Weblisite</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Building the future of AI-powered development, one app at a time
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-slate-300 leading-relaxed text-center max-w-3xl mx-auto">
              To democratize web development by making it accessible to everyone, regardless of their technical background. 
              We believe that great ideas shouldn't be limited by coding skills, and that AI can bridge the gap between 
              imagination and reality.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Weblisite was born from a simple observation: too many great ideas never see the light of day because 
                building them requires specialized technical knowledge.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                We set out to change that by creating the world's first truly AI-native development platform, where 
                anyone can describe their vision and watch it come to life in minutes, not months.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Today, we're proud to be at the forefront of the AI revolution in software development, powered by 
                Claude 4 Sonnet - the most advanced AI model available.
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We envision a world where the barrier between having an idea and bringing it to market is virtually eliminated.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                A world where entrepreneurs, creatives, and innovators can focus on what matters most - solving problems 
                and creating value - while AI handles the technical complexity.
              </p>
              <p className="text-slate-300 leading-relaxed">
                We're building the future where "I wish there was an app for that" becomes "Let me build that app right now."
              </p>
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Founder</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 flex items-center justify-center text-8xl font-bold text-blue-400">
                A
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Antony Mungai Kangau</h3>
                <p className="text-blue-400 mb-4 text-lg">Founder & CEO</p>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Antony is a visionary entrepreneur and technologist passionate about democratizing software development. 
                  With a deep understanding of both the technical challenges and human needs in the development space, 
                  he founded Weblisite to bridge the gap between ideas and implementation.
                </p>
                <div className="space-y-2">
                  <p className="text-slate-400">
                    📧 <a href="mailto:antony@weblisite.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                      antony@weblisite.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-slate-300">
                We're always pushing the boundaries of what's possible with AI and development technology.
              </p>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-slate-300">
                Great ideas should never be limited by technical barriers. We make development accessible to all.
              </p>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Speed</h3>
              <p className="text-slate-300">
                Time is precious. We help you go from idea to deployment in minutes, not months.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              We're just getting started. Be part of the revolution that's making software development accessible to everyone.
            </p>
            <div className="space-y-4">
              <a 
                href="mailto:antony@weblisite.com" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 mr-4"
              >
                Get in Touch
              </a>
              <a 
                href="/builder" 
                className="inline-block px-8 py-3 border border-white/20 hover:bg-white/10 rounded-lg font-medium transition-all duration-300"
              >
                Try Weblisite Free
              </a>
            </div>
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
} 
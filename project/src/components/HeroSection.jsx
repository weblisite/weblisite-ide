import React from "react"
import { Link } from "react-router-dom"

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Code Smarter with Weblisite
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              The next-generation browser-based IDE with AI-powered assistance, real-time collaboration, and instant previews.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Try Now
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-gray-800 rounded-lg shadow-xl p-4 mx-auto max-w-md">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-400 ml-4">index.js</div>
              </div>
              <pre className="text-sm text-blue-300 font-mono">
                <code>{`import React from 'react';
import { render } from 'react-dom';
import App from './App';

        // Weblisite - Smart code generation
function init() {
  render(<App />, document.getElementById('root'));
}

init();`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

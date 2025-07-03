import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import ContactForm from "../components/ContactForm"

function PropertyDetail() {
  const { id } = useParams();
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch the feature data from an API
    // Here we're using mock data for demonstration
    setTimeout(() => {
      setFeature({
        id: id,
        title: "Advanced Code Editor",
        description: "The Weblisite code editor provides a powerful and intuitive environment for writing code. With features like syntax highlighting, autocomplete, and intelligent code suggestions, it helps developers write better code faster.",
        longDescription: "Our code editor is built on modern web technologies and provides a native-like experience right in your browser. It supports all major programming languages and frameworks, with specialized features for each. The editor includes powerful navigation tools, code folding, multiple cursors, and a customizable interface that adapts to your preferences.",
        images: [],
        features: [
          "Syntax highlighting for 100+ languages",
          "Intelligent code completion",
          "Multiple cursors and selections",
          "Code folding and navigation",
          "Integrated terminal",
          "Git integration",
          "Customizable themes and keybindings"
        ],
        pricing: {
          free: ["Basic syntax highlighting", "Standard autocomplete", "Limited file size"],
          pro: ["Advanced syntax highlighting", "AI-powered autocomplete", "Unlimited file size", "Team collaboration features"]
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="hover:text-blue-600">Features</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{feature.title}</span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Feature header */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h1>
          
          {/* Main description */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-lg leading-relaxed mb-4">
              {feature.description}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {feature.longDescription}
            </p>
          </div>
          
          {/* Feature list */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <ul className="space-y-3">
                {feature.features.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Pricing comparison */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Available In</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Free Plan</h3>
                <ul className="space-y-2">
                  {feature.pricing.free.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button className="w-full bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-300 transition-colors">
                    Get Started Free
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 shadow-md rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Pro Plan</h3>
                <ul className="space-y-2">
                  {feature.pricing.pro.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
            <p className="text-gray-700 mb-6">
              Contact us for more information about this feature or to schedule a demo.
            </p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your question or comment"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Related features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Live Preview", "AI Assistant", "Collaboration Tools"].map((title, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">
                  Another powerful feature of the Weblisite platform.
                </p>
                <Link 
                  to={`/feature/${i + 2}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;

import React from 'react';
import FeaturedProperties from '../components/FeaturedProperties';
import CarCard from '../components/CarCard';

function Features() {
  const featureGroups = [
    {
      title: "Code Generation",
      description: "AI-powered tools to generate high-quality code from natural language prompts",
      features: [
        {
          id: 1,
          title: "Smart Completion",
          description: "Intelligent code completion that understands context and predicts your next line of code",
          tags: ["AI", "Productivity", "Code"],
          date: "April 2025"
        },
        {
          id: 2,
          title: "Refactoring Tools",
          description: "Automatically improve and refactor existing code to follow best practices",
          tags: ["Optimization", "Clean Code", "AI"],
          date: "April 2025"
        },
        {
          id: 3,
          title: "Component Generation",
          description: "Create complete React components from simple text descriptions",
          tags: ["React", "UI", "Generation"],
          date: "April 2025"
        }
      ]
    },
    {
      title: "Debugging & Testing",
      description: "Advanced tools for finding and fixing bugs quickly",
      features: [
        {
          id: 4,
          title: "Live Debugging",
          description: "Real-time debugging with variable inspection and breakpoints",
          tags: ["Debug", "Testing", "DevTools"],
          date: "April 2025"
        },
        {
          id: 5,
          title: "Test Generation",
          description: "Automatically generate unit and integration tests for your code",
          tags: ["Testing", "Quality", "Automation"],
          date: "April 2025"
        },
        {
          id: 6,
          title: "Error Prevention",
          description: "Proactive error detection that catches bugs before they happen",
          tags: ["Quality", "Prevention", "AI"],
          date: "April 2025"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Weblisite Features</h1>
            <p className="text-xl mb-8">
              Discover the powerful tools and features that make Weblisite the most advanced browser-based IDE for modern web development
            </p>
          </div>
        </div>
      </div>

      {/* Core features section */}
      <FeaturedProperties />
      
      {/* Advanced feature groups */}
      {featureGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={`py-16 ${groupIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{group.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {group.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {group.features.map((feature) => (
                <CarCard key={feature.id} car={feature} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Features;
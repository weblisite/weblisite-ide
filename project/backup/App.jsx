import React from 'react';
import './index.css';
// Import any components from the components directory like this:
// import ComponentName from './components/ComponentName';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Welcome to Our Application
      </h1>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">
          This is a starter React application. Replace this content with your own website content.
        </p>
      </div>
    </div>
  );
}

export default App;
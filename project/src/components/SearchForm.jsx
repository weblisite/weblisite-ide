import React, { useState } from 'react'
import { Search, MapPin, Home, DollarSign } from 'lucide-react'

function SearchForm() {
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: ''
  });
  
  // Event handlers
  
  // Fixed event handler for handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic
    console.log("Form submitted:", filters);
  };

  // Fixed event handler for handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Component content preserved but structured correctly */}
      
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            name="keyword"
            placeholder="Search..." 
            className="p-2 border rounded"
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Search
          </button>
          <button 
            type="button" 
            className="px-4 py-2 border rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
      
    </div>
  );
}

export default SearchForm;

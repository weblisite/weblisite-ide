import React, { useState } from "react"

function SearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    beds: "",
    baths: "",
    propertyType: ""
  });
  
  // Event handlers
  
  // Fixed event handler for handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Fixed event handler for handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic
    console.log("Form submitted:", filters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
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

export default SearchFilters;

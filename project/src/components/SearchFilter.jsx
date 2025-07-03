import React, { useState } from "react"

function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    minPrice: "",
    maxPrice: ""
  });
  
  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If onFilter prop exists, call it with current filters
    if (onFilter) {
      onFilter(filters);
    }
    console.log("Form submitted:", filters);
  };
  
  const handleReset = () => {
    setFilters({
      keyword: "",
      type: "",
      minPrice: "",
      maxPrice: ""
    });
    // If onFilter prop exists, call it with reset filters
    if (onFilter) {
      onFilter({});
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Search Projects</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            name="keyword"
            placeholder="Search by keyword..." 
            className="p-2 border rounded"
            value={filters.keyword}
            onChange={handleChange}
          />
          
          <select
            name="type"
            className="p-2 border rounded"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="">Project Type</option>
            <option value="web">Web Development</option>
            <option value="mobile">Mobile App</option>
            <option value="backend">Backend Service</option>
            <option value="ai">AI/ML Project</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="number" 
            name="minPrice"
            placeholder="Min Rating" 
            className="p-2 border rounded"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxPrice"
            placeholder="Max Rating" 
            className="p-2 border rounded"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-between">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
          <button 
            type="button" 
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchFilter;

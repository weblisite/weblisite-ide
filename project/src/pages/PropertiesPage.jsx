import React, { useState } from "react";
import SearchForm from "../components/SearchForm";
import PropertyCard from "../components/PropertyCard";

function PropertiesPage() {
  // Mock data for properties
  const allProperties = [
    {
      id: 1,
      title: "Modern Apartment with Ocean View",
      price: 450000,
      location: "Miami, FL",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Luxury Family Home",
      price: 850000,
      location: "Los Angeles, CA",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Downtown Penthouse",
      price: 1250000,
      location: "New York, NY",
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2200,
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Charming Suburban Home",
      price: 525000,
      location: "Austin, TX",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Waterfront Villa with Pool",
      price: 1750000,
      location: "San Diego, CA",
      bedrooms: 5,
      bathrooms: 4.5,
      area: 4200,
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Urban Loft in Historic Building",
      price: 675000,
      location: "Chicago, IL",
      bedrooms: 2,
      bathrooms: 2,
      area: 1650,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchParams) => {
    setIsSearching(true);
    
    // Mock search functionality
    const results = allProperties.filter(property => {
      // Filter by location
      if (searchParams.location && !property.location.toLowerCase().includes(searchParams.location.toLowerCase())) {
        return false;
      }
      
      // Filter by min price
      if (searchParams.minPrice && property.price < parseInt(searchParams.minPrice)) {
        return false;
      }
      
      // Filter by max price
      if (searchParams.maxPrice && property.price > parseInt(searchParams.maxPrice)) {
        return false;
      }
      
      // Filter by bedrooms
      if (searchParams.bedrooms && property.bedrooms < parseInt(searchParams.bedrooms)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredProperties(results);
    
    // Reset searching state after a delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-blue-600 py-12 text-white">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Property</h1>
          )<p className="text-xl">Browse our extensive collection of properties for sale</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-100">
        <div className="container">
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Properties List */}
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {isSearching ? (
                "Searching..."
              ) : (
                `${filteredProperties.length} Properties Available`
              )}
            </h2>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-gray-700">Sort by:</label>
              <select
                id="sort"
                className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
          
          {isSearching ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching for properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No properties match your search criteria.</p>
              <button
                className="mt-4 btn btn-secondary"
                onClick={() => setFilteredProperties(allProperties)}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="property-grid">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PropertiesPage;

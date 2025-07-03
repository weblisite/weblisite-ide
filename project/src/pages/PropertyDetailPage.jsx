import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ContactForm from "../components/ContactForm";

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mock property data - in a real app, this would be fetched from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProperty = {
        id: parseInt(id),
        title: "Luxury Family Home",
        description: "This stunning luxury family home offers spacious living areas, high-end finishes, and an exceptional location. Perfect for entertaining and family living, the property features an open floor plan, gourmet kitchen, and a private backyard oasis with a swimming pool.",
        price: 850000,
        location: "123 Luxury Lane, Los Angeles, CA 90210",
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        yearBuilt: 2018,
        garage: "2-car attached",
        lotSize: "0.25 acres",
        features: [
          "Gourmet kitchen with high-end appliances",
          "Open floor plan",
          "Hardwood floors throughout",
          "Smart home technology",
          "Energy-efficient windows",
          "Custom lighting fixtures",
          "Walk-in closets",
          "Spa-like master bathroom",
          "Covered patio",
          "Swimming pool"
        ],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        ],
        agent: {
          name: "Jennifer Martinez",
          phone: "(310) 555-1234",
          email: "jennifer@dreamhomes.com",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
        }
      };
      
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        )<p className="mt-2 text-gray-600">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        )<p className="text-gray-600 mb-6">Sorry, we couldn't find the property you're looking for.</p>
        <Link to="/properties" className="btn btn-primary">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Property Header */}
      <section className="bg-white border-b">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <Link to="/properties" className="text-blue-600 hover:underline mb-2 inline-block">
                &larr; Back to Properties
              </Link>
              )<h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-gray-600 text-lg mb-2">{property.location}</p>
              <div className="flex items-center">
                <span className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded">
                  For Sale
                </span>
                <span className="ml-4 text-blue-600 font-bold text-2xl">
                  ${property.price.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="btn btn-primary mr-2">
                Schedule Viewing
              </button>
              <button className="btn btn-secondary">
                Save Property
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Property Images */}
      <section className="py-6 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <img 
                src={property.images[0]} 
                alt={property.title} 
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {property.images.slice(1, 4).map((image, index) => (
              <div key={index}>
                <img 
                  src={image} 
                  alt={`${property.title} - Image ${index + 2}`} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
                <p className="text-gray-700 mb-6">
                  {property.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Bedrooms</p>
                    <p className="font-semibold text-lg">{property.bedrooms}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Bathrooms</p>
                    <p className="font-semibold text-lg">{property.bathrooms}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Area</p>
                    <p className="font-semibold text-lg">{property.area} sqft</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Year Built</p>
                    <p className="font-semibold text-lg">{property.yearBuilt}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-500">Garage:</p>
                    <p className="font-medium">{property.garage}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lot Size:</p>
                    <p className="font-medium">{property.lotSize}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Features & Amenities</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map view would be displayed here</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Listing Agent</h2>
                <div className="flex items-center mb-4">
                  <img 
                    src={property.agent.image} 
                    alt={property.agent.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{property.agent.name}</h3>
                    <p className="text-gray-600 text-sm">Dream Homes Real Estate</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {property.agent.phone}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {property.agent.email}
                  </p>
                </div>
                <button className="btn btn-primary w-full">
                  Contact Agent
                </button>
              </div>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-2/3"></div>
                  <div className="h-5 bg-gray-300 rounded animate-pulse mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

}

export default PropertyDetailPage;

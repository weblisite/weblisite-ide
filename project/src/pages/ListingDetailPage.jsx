jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProperty = () => {
      setLoading(true);
      
      // Sample property data based on ID
      const mockProperties = {
        1: {
          id: 1,
          title: "Modern Beachfront Villa",
          price: 1250000,
          description: "This stunning beachfront villa offers panoramic ocean views and luxurious living spaces. Featuring an open floor plan, gourmet kitchen, and expansive outdoor entertaining areas, this home is perfect for those seeking a premium coastal lifestyle. The property includes direct beach access and is located in an exclusive gated community.",
          images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1530&q=80"
          ],
          location: "Malibu, CA",
          address: "123 Ocean View Drive, Malibu, CA 90265",
          beds: 4,
          baths: 3,
          sqft: 3200,
          lotSize: "0.5 acres",
          yearBuilt: 2018,
          propertyType: "Single Family Home",
          parkingSpaces: 2,
          features: [
            "Ocean View", 
            "Swimming Pool", 
            "Outdoor Kitchen", 
            "Smart Home System", 
            "Home Theater", 
            "Walk-in Closets",
            "Hardwood Floors",
            "Fireplace",
            "Central Air Conditioning"
          ],
          agent: {
            name: "Jennifer Parker",
            phone: "(310) 555-1234",
            email: "jennifer@propertyfinder.com",
            image: "https://randomuser.me/api/portraits/women/45.jpg"
          }
        },
        2: {
          id: 2,
          title: "Downtown Luxury Apartment",
          price: 850000,
          description: "Experience urban living at its finest in this luxury apartment located in the heart of the city. This beautifully designed unit features high-end finishes, floor-to-ceiling windows with spectacular city views, and a spacious open concept layout. Building amenities include a 24-hour doorman, fitness center, rooftop terrace, and resident lounge.",
          images: [
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          ],
          location: "San Francisco, CA",
          address: "456 Market Street, Unit 1201, San Francisco, CA 94105",
          beds: 2,
          baths: 2,
          sqft: 1800,
          yearBuilt: 2015,
          propertyType: "Condo/Apartment",
          parkingSpaces: 1,
          features: [
            "City View", 
            "Concierge Service", 
            "Fitness Center", 
            "Rooftop Terrace", 
            "In-unit Laundry", 
            "Stainless Steel Appliances",
            "Quartz Countertops",
            "Walk-in Closet",
            "Pet Friendly"
          ],
          agent: {
            name: "Michael Rodriguez",
            phone: "(415) 555-6789",
            email: "michael@propertyfinder.com",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
          }
        },
        3: {
          id: 3,
          title: "Suburban Family Home",
          price: 580000,
          description: "This charming suburban home offers the perfect blend of comfort and functionality for family living. Featuring a spacious layout with an updated kitchen, large family room, and generous bedrooms. The fenced backyard includes a covered patio, perfect for outdoor entertaining. Located in a highly-rated school district with easy access to parks, shopping, and major highways.",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
            "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          ],
          location: "Austin, TX",
          address: "789 Maple Avenue, Austin, TX 78745",
          beds: 4,
          baths: 3,
          sqft: 2500,
          lotSize: "0.25 acres",
          yearBuilt: 2005,
          propertyType: "Single Family Home",
          parkingSpaces: 2,
          features: [
            "Updated Kitchen", 
            "Fenced Yard", 
            "Covered Patio", 
            "Master Suite", 
            "Walk-in Closets", 
            "Fireplace",
            "Ceiling Fans",
            "Granite Countertops",
            "Sprinkler System"
          ],
          agent: {
            name: "Sarah Johnson",
            phone: "(512) 555-4321",
            email: "sarah@propertyfinder.com",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
          }
        }
      };
      
      // Simulate API delay
      setTimeout(() => {
        if (mockProperties[id]) {
          setProperty(mockProperties[id]);
        }
        setLoading(false);
      }, 800);
    };
    
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/listings" className="btn btn-primary">
          Browse Other Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <Link to="/listings" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="relative h-[400px] mb-4 rounded-lg overflow-hidden">
            <img 
              src={property.images[activeImage]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image Thumbnails */}
          <div className="flex space-x-2 mb-6">
            {property.images.map((image, index) => (
              <div 
                key={index}
                className={`h-20 w-20 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${property.title} view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">${property.price.toLocaleString()}</p>
            
            <div className="flex flex-wrap text-gray-600 mb-6">
              <div className="mr-6 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}
              </div>
              <div className="mr-6 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}
              </div>
              <div className="mr-6 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                {property.sqft.toLocaleString()} sqft
              </div>
              <div className="mr-6 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
                {property.lotSize && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Lot Size</span>
                    <span className="font-medium">{property.lotSize}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Parking</span>
                  <span className="font-medium">{property.parkingSpaces} {property.parkingSpaces === 1 ? 'Space' : 'Spaces'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Address</span>
                  <span className="font-medium">{property.address}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
            
            <div className="flex items-center mb-6">
              <img 
                src={property.agent.image} 
                alt={property.agent.name} 
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">{property.agent.name}</h3>
                <p className="text-gray-600 text-sm">Listing Agent</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{property.agent.phone}</span>
              </div>
              <div className="flex items-center">

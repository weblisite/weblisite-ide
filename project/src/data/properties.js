js
// Mock data for properties
const properties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 350000,
    address: "123 Main St, New York, NY 10001",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "apartment",
    yearBuilt: 2018,
    description: "This beautiful modern apartment is located in the heart of downtown. Features include hardwood floors, stainless steel appliances, and floor-to-ceiling windows with amazing city views. The building offers a fitness center, rooftop terrace, and 24-hour concierge service.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1680&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80"
    ],
    features: [
      "Hardwood floors",
      "Stainless steel appliances",
      "Floor-to-ceiling windows",
      "Central air conditioning",
      "In-unit washer and dryer",
      "Walk-in closet",
      "Fitness center",
      "Rooftop terrace"
    ]
  },
  {
    id: 2,
    title: "Spacious Suburban House",
    price: 750000,
    address: "456 Oak Lane, Westchester, NY 10583",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    type: "house",
    yearBuilt: 2010,
    description: "This spacious family home is located in a quiet suburban neighborhood with excellent schools. Features include a large backyard, updated kitchen with granite countertops, master suite with walk-in closet, and finished basement. Perfect for growing families!",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1778&q=80"
    ],
    features: [
      "Large backyard",
      "Granite countertops",
      "Master suite",
      "Walk-in closet",
      "Finished basement",
      "Two-car garage",
      "Deck/patio",
      "Fireplace"
    ]
  },
  {
    id: 3,
    title: "Luxury Waterfront Condo",
    price: 1200000,
    address: "789 Harbor Blvd, Miami, FL 33139",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2200,
    type: "condo",
    yearBuilt: 2020,
    description: "Stunning waterfront condo with panoramic ocean views. This luxury unit features high-end finishes, smart home technology, and a gourmet kitchen. Building amenities include an infinity pool, private beach access, spa, and concierge services.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    ],
    features: [
      "Ocean views",
      "Smart home technology",
      "Gourmet kitchen",
      "Marble bathrooms",
      "Infinity pool",
      "Private beach access",
      "Spa and fitness center",
      "24/7 security"
    ]
  },
  {
    id: 4,
    title: "Downtown Commercial Space",
    price: 950000,
    address: "321 Business Ave, Chicago, IL 60601",
    bedrooms: 0,
    bathrooms: 2,
    area: 3500,
    type: "commercial",
    yearBuilt: 2015,
    description: "Prime commercial space in the heart of the business district. Open floor plan with high ceilings, modern design, and large windows. Perfect for office, retail, or restaurant use. High foot traffic area with excellent visibility.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
    ],
    features: [
      "Open floor plan",
      "High ceilings",
      "Large windows",
      "Modern design",
      "High foot traffic area",
      "ADA compliant",
      "Security system",
      "Storage space"
    ]
  },
  {
    id: 5,
    title: "Cozy Studio Apartment",
    price: 220000,
    address: "555 College St, Boston, MA 02215",
    bedrooms: 0,
    bathrooms: 1,
    area: 550,
    type: "apartment",
    yearBuilt: 2012,
    description: "Perfect starter home or investment property! This cozy studio apartment is located near major universities and public transportation. Features include updated kitchen appliances, built-in storage solutions, and a small balcony. Building offers laundry facilities and bike storage.",
    image: "https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    images: [

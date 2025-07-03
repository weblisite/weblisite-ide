import React from "react"
import { Link } from "react-router-dom"

function CarCard({ car = {} }) {
  const {
    id = 1,
    title = "Code Component",
    description = "A powerful component for Weblisite",
    image = "/placeholder.jpg",
    tags = ["React", "TypeScript", "Web"],
    date = "April 2025"
  } = car;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-sm font-medium">{title.split(' ')[0]}</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-1">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <Link 
          to={`/component/${id}`} 
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
        >
          View Details
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default CarCard;

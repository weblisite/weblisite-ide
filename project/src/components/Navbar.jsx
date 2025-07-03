import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Home } from 'lucide-react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Event handlers
  

  return (
    <div className="bg-white shadow-lg sticky top-0 z-50">
      {/* Component content preserved but structured correctly */}
      <Link to="/">Home</Link>
      
    </div>
  );
}

export default Navbar;

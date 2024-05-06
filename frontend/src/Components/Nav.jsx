import React from 'react'
import { useState } from 'react';
function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };
    return (
        <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo/Home */}
            <a href="#" className="text-white text-lg font-semibold">Logo/Home</a>
            
            {/* Hamburger Icon (for small screens) */}
            <div className="md:hidden">
              <button onClick={toggleNavbar} className="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
  
            {/* Responsive Navbar */}
            <div className={`md:flex ${isOpen ? 'block' : 'hidden'}`}>
              <a href="#" className="text-white py-2 px-4 hover:bg-gray-700">Notification</a>
              <a href="#" className="text-white py-2 px-4 hover:bg-gray-700">Friends</a>
            </div>
          </div>
        </div>
      </nav>
    );
  };
    

export default Nav

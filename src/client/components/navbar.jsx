// src/components/Navbar.js

import React from 'react';
// MODIFIED: Import useNavigate to handle redirection after logout
import { NavLink, useNavigate } from 'react-router-dom';
// NOTE: useState was unused, so it's removed for cleanliness.

const Navbar = () => {
  // ADDED: Initialize the useNavigate hook
  const navigate = useNavigate();

  // This function remains unchanged
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses =
      "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-in-out";

    if (isActive) {
      return `${baseClasses} bg-blue-400/30 text-blue-200 shadow-md`;
    } else {
      return `${baseClasses} text-white hover:text-blue-300 hover:bg-blue-400/20`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');

    navigate('/');
  };

  return (
    <header className="flex flex-col items-center p-6 w-full">
      <nav className="bg-sky-950/50 backdrop-blur-md p-4 rounded-full w-full max-w-4xl border border-blue-400/20 shadow-lg">
        <ul className="flex items-center justify-center space-x-3 md:space-x-4">
          <li>
            <NavLink to="/dashboard" className={getNavLinkClass}>
              Application
            </NavLink>
          </li>
          <li>
            <NavLink to="/log" className={getNavLinkClass}>
              Logs
            </NavLink>
          </li>
          <li>
            <NavLink to="/features" className={getNavLinkClass}>
              Features
            </NavLink>
          </li>
          <li>
      
            <button 
              onClick={handleLogout} 
      
              className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-in-out text-white hover:text-blue-300 hover:bg-blue-400/20"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
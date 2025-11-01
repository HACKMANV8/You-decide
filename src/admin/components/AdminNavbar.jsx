import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Shield, List, ShieldCheck, LogOut, TrendingUp } from "lucide-react";

const Navbar = () => {
  // useNavigate hook from react-router-dom to handle redirection
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication token from local storage
    localStorage.removeItem("authToken");
    
    // Redirect user to the login page
    navigate("/login"); 
  };

  // Common Tailwind classes for NavLink for easy reuse
  const linkClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-gray-700 text-white";
  const inactiveLinkClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-white";

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Brand/Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Shield size={28} className="text-blue-500" />
            <span className="text-white text-xl font-bold">Admin Panel</span>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/admin/all-logs"
              className={({ isActive }) => 
                `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <List size={16} />
              <span>All Logs</span>
            </NavLink>
            <NavLink
              to="/admin/blocked-ips"
              className={({ isActive }) => 
                `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <ShieldCheck size={16} />
              <span>Blocked IPs</span>
            </NavLink>
            <NavLink
              to="/admin/log-analysis"
              className={({ isActive }) => 
                `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <TrendingUp size={16} />
              <span>Log Analysis</span>
            </NavLink>
          </div>

          {/* Right Side: Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200 hover:scale-105"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
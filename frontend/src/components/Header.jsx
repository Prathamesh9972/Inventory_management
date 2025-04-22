import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="bg-white shadow-lg">
      {/* Top Bar with Logo and User Controls */}
      <div className="border-b bg-gray-100 py-3 px-6">
        <div className="flex justify-between items-center">
          {/* Logo with enhanced styling */}
          <div className="text-3xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
            S.S.Enterprises Pvt. Ltd.
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-white bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg"
                >
                  <span className="mr-2">{user.name || "User"}</span>
                  <i className="bi bi-person-circle text-xl"></i>
                </button>

                {/* Profile Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 w-56 bg-gray-800 text-white shadow-lg rounded-lg mt-2">
                    <div className="px-4 py-3 text-lg font-semibold border-b border-gray-700">
                      {user.name || "User"}
                    </div>
                    <div className="px-4 py-1 text-sm text-gray-400">{user.role || "Administrator"}</div>
                    <div className="border-t border-gray-700"></div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600 transition duration-200">
                      My Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600 transition duration-200">
                      Settings
                    </Link>
                    <div className="border-t border-gray-700"></div>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600 transition duration-200">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/" className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="bg-white py-4 shadow-md">
        <div className="max-w-screen-xl mx-auto px-6">
          <nav className="flex justify-center space-x-8">
            <Link 
              to="/chemicals" 
              className={`bg-white border-2 border-blue-500 text-gray-700 no-underline ${activeTab === 'chemicals' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600 hover:text-gray-900'} py-2 px-6 rounded-full transition duration-300 ease-in-out`}
              onClick={() => setActiveTab('chemicals')}
            >
              Chemicals
            </Link>

            <Link 
              to="/purchases" 
              className={`bg-white border-2 border-blue-500 text-gray-700 no-underline ${activeTab === 'purchases' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600 hover:text-gray-900'} py-2 px-6 rounded-full transition duration-300 ease-in-out`}
              onClick={() => setActiveTab('purchases')}
            >
              Purchases
            </Link>

            <Link 
              to="/sales" 
              className={`bg-white border-2 border-blue-500 text-gray-700 no-underline ${activeTab === 'sales' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600 hover:text-gray-900'} py-2 px-6 rounded-full transition duration-300 ease-in-out`}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </Link>

            <Link 
              to="/safety" 
              className={`bg-white border-2 border-blue-500 text-gray-700 no-underline ${activeTab === 'safety' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600 hover:text-gray-900'} py-2 px-6 rounded-full transition duration-300 ease-in-out`}
              onClick={() => setActiveTab('safety')}
            >
              Safety
            </Link>

            <Link 
              to="/reports" 
              className={`bg-white border-2 border-blue-500 text-gray-700 no-underline ${activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600 hover:text-gray-900'} py-2 px-6 rounded-full transition duration-300 ease-in-out`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </Link>

            <Link 
              to="/staff_add" 
              className={`bg-white border-2 border-blue-500 text-gray-700 no-underline ${activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600 hover:text-gray-900'} py-2 px-6 rounded-full transition duration-300 ease-in-out`}
              onClick={() => setActiveTab('reports')}
            >
              Staff
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;

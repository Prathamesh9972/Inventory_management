import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage
  
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <Header />
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-3xl font-semibold mb-6 text-center text-yellow-600">Dashboard</h4>
          {user ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-xl font-medium">Welcome, <span className="text-yellow-600">{user.name}</span></h2>
                <p className="text-lg text-gray-500">{user.role}</p>
              </div>

              {/* Statistics Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center">
                  <h5 className="text-xl font-semibold text-yellow-600">Total Chemicals</h5>
                  <p className="text-3xl text-gray-700">1,254</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center">
                  <h5 className="text-xl font-semibold text-yellow-600">Total Purchases</h5>
                  <p className="text-3xl text-gray-700">784</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center">
                  <h5 className="text-xl font-semibold text-yellow-600">Total Sales</h5>
                  <p className="text-3xl text-gray-700">432</p>
                </div>
              </div>

              {/* Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-yellow-100 transition duration-300 cursor-pointer" onClick={() => handleNavigation('/chemicals')}>
                  <div className="flex items-center justify-center text-4xl mb-4 text-yellow-600">
                    <i className="bi bi-flask"></i>
                  </div>
                  <h5 className="text-xl text-center text-gray-800">Chemicals</h5>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-yellow-100 transition duration-300 cursor-pointer" onClick={() => handleNavigation('/purchases')}>
                  <div className="flex items-center justify-center text-4xl mb-4 text-yellow-600">
                    <i className="bi bi-cart-check"></i>
                  </div>
                  <h5 className="text-xl text-center text-gray-800">Purchases</h5>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-yellow-100 transition duration-300 cursor-pointer" onClick={() => handleNavigation('/sales')}>
                  <div className="flex items-center justify-center text-4xl mb-4 text-yellow-600">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <h5 className="text-xl text-center text-gray-800">Sales</h5>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-yellow-100 transition duration-300 cursor-pointer" onClick={() => handleNavigation('/safety')}>
                  <div className="flex items-center justify-center text-4xl mb-4 text-yellow-600">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <h5 className="text-xl text-center text-gray-800">Safety</h5>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-yellow-100 transition duration-300 cursor-pointer" onClick={() => handleNavigation('/reports')}>
                  <div className="flex items-center justify-center text-4xl mb-4 text-yellow-600">
                    <i className="bi bi-file-earmark-text"></i>
                  </div>
                  <h5 className="text-xl text-center text-gray-800">Reports</h5>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-yellow-600" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-gray-400">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

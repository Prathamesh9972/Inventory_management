import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';

const Staff_cred = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !username || !password ) {
      setError('All fields are required');
      return;
    }

    const staffData = { name, username, password };

    try {
      const response = await fetch('http://localhost:5000/api/users/staff_add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData),
      });

      const result = await response.json();

      if (response.ok) {
        // alert('Staff created successfully!');
        toast.success("Staff Created Sucessfully");
         // 🧹 Clear form fields
        setName('');
        setUsername('');
        setPassword('');
        navigate('/staff_add'); // Redirect to staff list page
       
      } else {
        setError(result.message || 'Error creating staff');
      }
    } catch (error) {
      setError('Error connecting to server');
    }
  };


  return (
    <>
    <Header/>
    <br/>
    <h1 className="px-4 text-2xl font-bold mb-4">Add New Staff Member</h1>
    <div className="max-w-2xl mx-auto p-6  bg-white shadow-md rounded-lg">
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Staff
        </button>
      </form>
    </div>
    </>
    
  );
};

export default Staff_cred;

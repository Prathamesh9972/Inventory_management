import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      });
    console.log("From local the user : ",res.data)
      if (res.data && res.data.role=="admin") {
        localStorage.setItem('user', JSON.stringify(res.data)); // Store user info in localStorage
        navigate('/dashboard'); // Redirect to dashboard after login
      }
      else {
        localStorage.setItem('user', JSON.stringify(res.data)); // Store user info in localStorage
        navigate('/staff/dashboard'); // Redirect to dashboard after login
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const background = {
    backgroundImage: `url('/login.png')`, // path from public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '90vh', // full screen
  };
  

  return (
    <div style={background}>
    <div className="login-container"  style={background}>
          <div className="login-card bg-gray-800 ">
            <h2 className="login-title">Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="login-button">Login</button>
              </div>
            </form>
          </div>
        </div>
    </div>
    
  );
};

export default Login;
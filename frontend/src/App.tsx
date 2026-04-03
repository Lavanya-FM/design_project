import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Gallery from './components/Gallery';
import DesignDetail from './pages/DesignDetail';
import CustomizeForm from './pages/CustomizeForm';
import DesignerDashboard from './pages/DesignerDashboard';
import DesignerOrderDetail from './pages/DesignerOrderDetail';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css';

interface User {
  id: number;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/gallery" /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/gallery" 
            element={
              user ? <Gallery /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/designs/:id" 
            element={<DesignDetail />} 
          />
          <Route 
            path="/customize/:id" 
            element={<CustomizeForm />} 
          />
          <Route 
            path="/designer/dashboard" 
            element={<DesignerDashboard />} 
          />
          <Route 
            path="/designer/orders/:id" 
            element={<DesignerOrderDetail />} 
          />
          <Route 
            path="/orders/tracking" 
            element={<OrderTracking />} 
          />
          <Route 
            path="/admin/dashboard" 
            element={<AdminDashboard />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

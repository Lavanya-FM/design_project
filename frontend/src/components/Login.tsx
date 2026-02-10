import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (user: any, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user, response.access_token);
      navigate('/gallery');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-white hover:opacity-80 transition"
        >
          FIT & FLARE STUDIO
        </button>
        <div className="text-sm text-white opacity-90">Premium Tailoring Excellence</div>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <i className="fas fa-lock text-purple-600 text-xl"></i>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Fit & Flare Studio</h1>
        <p className="text-center text-gray-600 mb-8">Secure access to your bespoke wardrobe</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or mobile number
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              style={{outline: 'none', border: '1px solid #d1d5db'}}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                style={{outline: 'none', border: '1px solid #d1d5db'}}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
                style={{position: 'absolute', right: '0.75rem', top: '0.75rem', background: 'none', border: 'none', cursor: 'pointer'}}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="text-right mb-6">
            <a href="#" className="text-sm text-purple-600 hover:text-purple-800">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn"
            style={{backgroundColor: '#111827', color: 'white', opacity: loading ? 0.5 : 1}}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          <button
            type="button"
            className="w-full btn"
            style={{backgroundColor: 'white', color: '#111827', border: '1px solid #d1d5db', marginTop: '0.75rem'}}
            onClick={() => setError('Signup functionality coming soon!')}
          >
            Sign Up
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-sm text-white">
        © 2024 Fit & Flare Studio. All rights reserved.{' '}
        <a href="#" className="text-purple-200 hover:text-white">
          Privacy Policy
        </a>{' '}
        <a href="#" className="text-purple-200 hover:text-white">
          Terms of Service
        </a>
      </div>
    </div>
  );
};

export default Login;

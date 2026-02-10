import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CONFIG from '../config';
import '../styles/Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : { fullName: formData.fullName, email: formData.email, password: formData.password };

        try {
            const response = await axios.post(`${CONFIG.API_URL}${endpoint}`, payload);

            // Save token and user details
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = () => {
        localStorage.setItem('isGuest', 'true');
        navigate('/customizer');
    };

    return (
        <div className="login-page">
            <Navbar />
            <div className="auth-card-wrapper fade-in">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="auth-icon">🔒</span>
                        <h2>{isLogin ? 'Fit & Flare Studio' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Secure access to your bespoke wardrobe' : 'Join us for a tailored experience'}</p>
                    </div>

                    {error && <div className="auth-error-msg" style={{ color: '#D02F44', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center', background: '#FFEBEE', padding: '8px', borderRadius: '4px' }}>{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="form-input"
                                required
                            />
                        </div>

                        {isLogin && (
                            <div className="form-actions">
                                <a href="#" className="forgot-password">Forgot Password?</a>
                            </div>
                        )}

                        <button className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <button className="btn btn-outline btn-block" onClick={handleGuest}>
                        Continue as Guest
                    </button>

                    <div className="auth-footer">
                        {isLogin ? (
                            <p>Don't have an account? <button className="link-btn" onClick={() => setIsLogin(false)}>Sign Up</button></p>
                        ) : (
                            <p>Already have an account? <button className="link-btn" onClick={() => setIsLogin(true)}>Login</button></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

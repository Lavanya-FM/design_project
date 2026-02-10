import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock Login
        localStorage.setItem('user', JSON.stringify({ role: 'customer', email: email }));
        showToast("Welcome back to the Studio!", "success");
        navigate('/collections');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card customer animate-me">
                    <span className="role-badge badge-customer">Customer Entry</span>
                    <div className="auth-form">
                        <h2>Welcome Back</h2>
                        <p className="tagline">Sign in to resume your custom tailoring journey</p>

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Email or Phone</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your registered contact"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Password</label>
                                <input type="password" className="form-input" placeholder="••••••••" required />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px' }}>
                                Sign In
                            </button>
                        </form>

                        <div className="divider">OR</div>

                        <button className="btn-outline-auth" onClick={() => navigate('/collections')}>
                            Shop as Guest
                        </button>

                        <div className="auth-footer">
                            New to Fit & Flare? <Link to="/auth/customer/signup">Create an Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerLogin;

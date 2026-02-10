import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const CustomerSignup = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSignup = (e) => {
        e.preventDefault();
        showToast("Account created! Let's start designing.", "success");
        navigate('/auth/customer/login');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card customer animate-me">
                    <span className="role-badge badge-customer">Customer Signup</span>
                    <div className="auth-form">
                        <h2>Join the Studio</h2>
                        <p className="tagline">Create an account for a seamless tailoring experience</p>

                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-input" placeholder="e.g. Lavanya P." required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" placeholder="name@example.com" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Phone Number</label>
                                <input type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Set Password</label>
                                <input type="password" className="form-input" placeholder="Minimum 8 characters" required />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px' }}>
                                Create Account
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account? <Link to="/auth/customer/login">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerSignup;

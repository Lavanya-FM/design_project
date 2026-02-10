import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const VendorLogin = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify({ role: 'vendor' }));
        showToast("Vendor Inventory Hub Connected", "success");
        navigate('/vendor');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card vendor animate-me">
                    <span className="role-badge badge-vendor">Merchant Portal</span>
                    <div className="auth-form">
                        <h2>Vendor Sign In</h2>
                        <p className="tagline">Manage your fabric supply and availability</p>

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Business Email</label>
                                <input type="email" className="form-input" placeholder="vendor@wholesale.com" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Secure Password</label>
                                <input type="password" className="form-input" placeholder="••••••••" required />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px', background: '#e17055', borderColor: '#e17055' }}>
                                Access Inventory
                            </button>
                        </form>

                        <div className="auth-footer">
                            Want to supply fabric? <Link to="/auth/vendor/signup">Become a Partner</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VendorLogin;

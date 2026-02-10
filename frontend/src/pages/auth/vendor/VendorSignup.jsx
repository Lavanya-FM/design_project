import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const VendorSignup = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSignup = (e) => {
        e.preventDefault();
        showToast("Vendor request submitted. Our team will verify your business.", "success");
        navigate('/auth/vendor/login');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card vendor animate-me">
                    <span className="role-badge badge-vendor">Merchant Onboarding</span>
                    <div className="auth-form">
                        <h2>Partner with Us</h2>
                        <p className="tagline">List your fabric collection for our studio artisans</p>

                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <label className="form-label">Business / Company Name</label>
                                <input type="text" className="form-input" placeholder="e.g. Royal Silks Pvt Ltd" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Merchant Category</label>
                                <select className="form-input" required>
                                    <option>Wholesale Silk</option>
                                    <option>Ethnic Fabrics</option>
                                    <option>Embroidery Material</option>
                                    <option>Designer Lace & Props</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Contact Email</label>
                                <input type="email" className="form-input" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Warehouse Address</label>
                                <textarea className="form-input" rows="3" required></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px', background: '#e17055', borderColor: '#e17055' }}>
                                Apply for Partnership
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already a partner? <Link to="/auth/vendor/login">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VendorSignup;

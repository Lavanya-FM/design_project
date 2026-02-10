import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const DesignerSignup = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSignup = (e) => {
        e.preventDefault();
        showToast("Application received! We'll review your portfolio soon.", "success");
        navigate('/auth/designer/login');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card designer animate-me">
                    <span className="role-badge badge-designer">Join as Artisan</span>
                    <div className="auth-form">
                        <h2>Designer Application</h2>
                        <p className="tagline">Showcase your craftsmanship to a global audience</p>

                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <label className="form-label">Artist Name / Studio Name</label>
                                <input type="text" className="form-input" placeholder="e.g. Aisha's Boutique" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Work Email</label>
                                <input type="email" className="form-input" placeholder="designer@example.com" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Portfolio Link (Instagram/Behance)</label>
                                <input type="text" className="form-input" placeholder="https://..." required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Primary Craft (e.g. Zardosi, Bridal)</label>
                                <input type="text" className="form-input" placeholder="Handcrafted embroidery, etc." required />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px', background: '#6c5ce7', borderColor: '#6c5ce7' }}>
                                Submit Application
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already an partner? <Link to="/auth/designer/login">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DesignerSignup;

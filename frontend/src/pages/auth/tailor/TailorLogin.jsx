import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const TailorLogin = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify({ role: 'tailor' }));
        showToast("Tailor Workshop Synced!", "success");
        navigate('/tailor');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card tailor animate-me">
                    <span className="role-badge badge-tailor">Tailor Workstation</span>
                    <div className="auth-form">
                        <h2>Master Login</h2>
                        <p className="tagline">Access stitching orders and live progress studio</p>

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Registered Mobile / Email</label>
                                <input type="text" className="form-input" placeholder="+91 XXXXX XXXXX" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Secure Access PIN</label>
                                <input type="password" className="form-input" placeholder="••••••••" required />
                            </div>

                            <div style={{ marginTop: '20px', padding: '12px', background: '#e6fffb', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                                <p style={{ fontSize: '0.75rem', color: '#006d75', margin: 0 }}>
                                    🔒 <b>Authorized Access Only:</b> Your location and device are being logged for order security.
                                </p>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px', background: '#00b894', borderColor: '#00b894' }}>
                                Start Session
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TailorLogin;

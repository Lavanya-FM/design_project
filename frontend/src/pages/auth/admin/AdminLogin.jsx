import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
        showToast("Access Granted. Systems Online.", "success");
        navigate('/admin');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card admin animate-me">
                    <span className="role-badge badge-admin">Terminal Access</span>
                    <div className="auth-form">
                        <h2>Admin Authority</h2>
                        <p className="tagline">System-level access for platform orchestration</p>

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Administrator ID (Email)</label>
                                <input type="email" className="form-input" placeholder="admin@fitflare.com" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">System Password</label>
                                <input type="password" className="form-input" placeholder="••••••••" required />
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">2FA Authorization Code</label>
                                <input type="text" className="form-input" placeholder="Enter 6-digit code" maxLength="6" />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '32px', background: '#2d3436', borderColor: '#2d3436' }}>
                                Unlock Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;

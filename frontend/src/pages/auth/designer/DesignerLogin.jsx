import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const DesignerLogin = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify({ role: 'designer' }));
        showToast("Welcome back, Artisan!", "success");
        navigate('/designer');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card designer animate-me">
                    <span className="role-badge badge-designer">Designer Portal</span>
                    <div className="auth-form">
                        <h2>Workstation Login</h2>
                        <p className="tagline">Access your portfolio and manage your style exports</p>
                        
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Professional Email</label>
                                <input type="email" className="form-input" placeholder="designer@studio.com" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Key Password</label>
                                <input type="password" className="form-input" placeholder="••••••••" required />
                            </div>
                            
                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px', background: '#6c5ce7', borderColor: '#6c5ce7' }}>
                                Enter Workspace
                            </button>
                        </form>

                        <div className="auth-footer">
                            Want to sell your designs? <Link to="/auth/designer/signup">Apply as Designer</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DesignerLogin;

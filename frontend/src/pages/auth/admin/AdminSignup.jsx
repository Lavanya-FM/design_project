import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const AdminSignup = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSignup = (e) => {
        e.preventDefault();
        showToast("Admin account created! Contact senior admin for activation.", "success");
        navigate('/auth/admin/login');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card admin animate-me">
                    <span className="role-badge badge-admin">Internal Admin Access</span>
                    <div className="auth-form">
                        <h2>New Administrator</h2>
                        <p className="tagline">Create an internal account for studio management</p>

                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-input" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Employee ID / Email</label>
                                <input type="text" className="form-input" placeholder="e.g. EMP123" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Secret Invitation Code</label>
                                <input type="password" className="form-input" placeholder="REQUIRED FOR SETUP" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Set Master Password</label>
                                <input type="password" className="form-input" placeholder="••••••••" required />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px', background: '#6c5ce7', borderColor: '#6c5ce7' }}>
                                Initialize Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSignup;

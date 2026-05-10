import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../components/Toast';
import '../../../styles/Auth.css';

const TailorSignup = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSignup = (e) => {
        e.preventDefault();
        showToast("Workshop registration submitted!", "success");
        navigate('/auth/tailor/login');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-form-card tailor animate-me">
                    <span className="role-badge badge-tailor">Tailor Partnership</span>
                    <div className="auth-form">
                        <h2>Join the Atelier</h2>
                        <p className="tagline">Register your workshop to start receiving stitching orders</p>

                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <label className="form-label">Workshop Name / Master Name</label>
                                <input type="text" className="form-input" placeholder="e.g. Elite Stitching Studio" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Phone Number</label>
                                <input type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" required />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Expertise</label>
                                <select className="form-input" required>
                                    <option>Bridal Blouses</option>
                                    <option>Heavy Maggam Work</option>
                                    <option>Standard Ethnic Wear</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Set PIN / Password</label>
                                <input type="password" className="form-input" placeholder="••••••••" required />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '30px', background: '#00b894', borderColor: '#00b894' }}>
                                Register Workshop
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already registered? <Link to="/auth/tailor/login">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TailorSignup;

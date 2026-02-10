import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Measurements.css';

const MeasurementCapture = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, totalPrice } = location.state || {};

    const [step, setStep] = useState(1);
    const [measurements, setMeasurements] = useState({
        bust: '',
        waist: '',
        length: '',
        shoulder: '',
        sleeve_length: '',
        sleeve_round: ''
    });

    const handleInput = (e) => setMeasurements({ ...measurements, [e.target.name]: e.target.value });

    return (
        <div className="measurements-page">
            <Navbar />
            <div className="container measurements-container animate-me">
                <div className="measurements-card glass-panel">
                    <header className="measure-header">
                        <div className="step-count">Step {step} of 2</div>
                        <h1>Perfect Fit Studio</h1>
                        <p>Provide your measurements for a precision tailoring experience.</p>
                    </header>

                    {step === 1 ? (
                        <div className="measure-content">
                            <div className="measure-guide">
                                <div className="guide-img">📏</div>
                                <h3>Measurement Guide</h3>
                                <p>Use a soft measuring tape. Stand straight and keep the tape parallel to the floor.</p>
                            </div>

                            <div className="measure-form-grid">
                                {Object.keys(measurements).map(key => (
                                    <div key={key} className="form-group">
                                        <label>{key.replace('_', ' ')} (inches)</label>
                                        <input
                                            type="number"
                                            name={key}
                                            placeholder="e.g. 34"
                                            value={measurements[key]}
                                            onChange={handleInput}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-primary btn-block" style={{ marginTop: '40px' }} onClick={() => setStep(2)}>
                                Verify with AI Vision
                            </button>
                        </div>
                    ) : (
                        <div className="measure-content ai-step">
                            <div className="ai-verification-mock">
                                <div className="scanning-line"></div>
                                <div className="camera-view">
                                    <span>[ Placeholder for AI Verification Camera ]</span>
                                </div>
                                <div className="ai-meta">
                                    <h4>AI Analysis Active</h4>
                                    <p>Our algorithms are verifying your measurements against your body profile.</p>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout/review', { state: { config, measurements, totalPrice } })}>
                                Confirm & Review Order
                            </button>
                            <button className="btn btn-text" onClick={() => setStep(1)}>Go Back</button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MeasurementCapture;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Customizer.css';

const Customizer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const prefill = location.state?.prefill || {};

    const [activeTab, setActiveTab] = useState('Style');
    const [config, setConfig] = useState({
        neck: prefill.neck?.[0] || 'Deep U',
        sleeve: prefill.sleeve?.[0] || 'Short Sleeves',
        fabric: prefill.fabric?.[0] || 'Silk',
        work: prefill.work_type || 'Zari Work',
        color: '#D02F44', // Default Maroon
    });

    const OPTIONS = {
        Style: {
            neck: ['Deep U', 'V Neck', 'Sweetheart', 'Boat Neck', 'Deep Round', 'High Neck'],
            sleeve: ['Sleeveless', 'Short Sleeves', 'Elbow Length', 'Full Sleeves']
        },
        Fabric: {
            fabric: ['Silk', 'Velvet', 'Cotton Silk', 'Net/Lace', 'Brocade'],
            color: ['#D02F44', '#1B4D3E', '#002366', '#FFD700', '#000000']
        },
        Details: {
            work: ['Zari Work', 'Aari Embroidery', 'Stone Work', 'Mirror Work', 'Plain']
        }
    };

    const updateConfig = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

    const basePrice = prefill.base_price || 4500;
    const totalPrice = basePrice +
        (config.work !== 'Plain' ? 2000 : 0) +
        (config.sleeve === 'Full Sleeves' ? 800 : 0);

    return (
        <div className="customizer-page">
            <Navbar />
            <div className="customizer-layout">
                {/* 3D / SVG Preview Area */}
                <div className="preview-container">
                    <div className="preview-card animate-me">
                        <div className="preview-label">Live Design Preview</div>
                        <div className="svg-wrapper">
                            {/* SVG Mockup for Blouse */}
                            <svg viewBox="0 0 200 200" className="blouse-svg" style={{ fill: config.color }}>
                                <path d="M50,40 Q100,20 150,40 L160,120 Q100,140 40,120 Z" />
                                {/* Dynamic Neck Line */}
                                <circle cx="100" cy="50" r="25" fill="#FDF8F0" />
                            </svg>
                        </div>
                        <div className="preview-meta">
                            <span>Selected: {config.neck} + {config.sleeve}</span>
                        </div>
                    </div>
                </div>

                {/* Interaction / Controls Area */}
                <div className="controls-container animate-me">
                    <div className="controls-card glass-panel">
                        <header className="controls-header">
                            <h1>Customize Your Blouse</h1>
                            <p>Designing: <strong>{prefill.name || 'Custom Wedding Style'}</strong></p>
                        </header>

                        <div className="tab-navigation">
                            {Object.keys(OPTIONS).map(tab => (
                                <button
                                    key={tab}
                                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="tab-content">
                            {Object.entries(OPTIONS[activeTab]).map(([key, vals]) => (
                                <div key={key} className="option-group">
                                    <label>{key.replace('_', ' ')}</label>
                                    <div className="option-grid">
                                        {vals.map(v => (
                                            <div
                                                key={v}
                                                className={`option-pill ${config[key] === v ? 'selected' : ''}`}
                                                onClick={() => updateConfig(key, v)}
                                                style={key === 'color' ? { background: v, width: '40px', height: '40px', borderRadius: '50%' } : {}}
                                            >
                                                {key !== 'color' && v}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <footer className="controls-footer">
                            <div className="price-estimation">
                                <span className="label">Estimated Total</span>
                                <span className="price">₹{totalPrice}</span>
                            </div>
                            <button className="btn btn-primary btn-block" onClick={() => navigate('/measurements', { state: { config, totalPrice } })}>
                                Save Design & Measure
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Customizer;

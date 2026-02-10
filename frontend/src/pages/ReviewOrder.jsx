import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Checkout.css';

const ReviewOrder = () => {
    const navigate = useNavigate();
    const [confirmed, setConfirmed] = useState(false);

    // Read from localStorage or use defaults
    const savedData = JSON.parse(localStorage.getItem('currentOrder') || '{}');

    // Get a preview image (from the first step selection or a default)
    const previewImage = savedData.selections?.['1']?.image || 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=800';

    const designSummary = {
        style: 'Custom Blouse',
        selections: Object.entries(savedData.selections || {}).map(([step, opt]) => ({
            label: `Step ${step}`,
            value: opt.title,
            price: opt.price
        })),
        addons: (savedData.addons || []).map(a => ({ label: a.name, price: a.price })),
        measurements: savedData.measurements || {
            bust: 34, waist: 28, shoulder: 14, armhole: 16, length: 14
        }
    };

    const total = savedData.total || 1000;

    return (
        <>
            <Navbar />
            <div className="page-container checkout-page">
                <div className="container">
                    <h1 className="page-title">Review Your Design</h1>

                    <div className="checkout-grid">
                        {/* LEFT COLUMN */}
                        <div className="checkout-left">
                            <div className="review-card">
                                <div className="design-preview-hero" style={{ marginBottom: '20px' }}>
                                    <img src={previewImage} alt="Selected Design" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }} />
                                    <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px', textAlign: 'center' }}>Design Reference Preview</p>
                                </div>
                                <div className="card-header">
                                    <h3>Design Specifications</h3>
                                    <Link to="/customizer" className="edit-link">Edit</Link>
                                </div>
                                <div className="specs-list">
                                    {designSummary.selections.map((item, idx) => (
                                        <div key={idx} className="spec-row">
                                            <span className="spec-label">{item.label}</span>
                                            <span className="spec-value">{item.value}</span>
                                        </div>
                                    ))}
                                    {designSummary.addons.map((item, idx) => (
                                        <div key={`addon-${idx}`} className="spec-row">
                                            <span className="spec-label">Add-on</span>
                                            <span className="spec-value">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="review-card">
                                <div className="card-header">
                                    <h3>Measurements</h3>
                                    <Link to="/customizer" className="edit-link">Edit</Link>
                                </div>
                                <div className="measurements-grid">
                                    {Object.entries(designSummary.measurements).map(([key, value]) => (
                                        <div key={key} className="measure-box">
                                            <span className="m-val">{value}"</span>
                                            <span className="m-label">{key}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="checkout-right">
                            <div className="price-card">
                                <h3>Order Summary</h3>
                                <div className="price-rows">
                                    <div className="price-row">
                                        <span>Base Stitching</span>
                                        <span>₹1,000</span>
                                    </div>
                                    {designSummary.selections.filter(s => s.price > 0).map((s, i) => (
                                        <div key={i} className="price-row">
                                            <span>{s.value} Style Premium</span>
                                            <span>₹{s.price}</span>
                                        </div>
                                    ))}
                                    {designSummary.addons.map((s, i) => (
                                        <div key={`a-${i}`} className="price-row">
                                            <span>{s.label}</span>
                                            <span>₹{s.price}</span>
                                        </div>
                                    ))}
                                    <div className="price-row gst-row">
                                        <span>Estimated Taxes (GST)</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="price-row total-row">
                                        <span>Total Amount</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="delivery-est-card">
                                        <div className="est-info">
                                            <span>🚚 Standard Delivery</span>
                                            <strong>15 Aug 2024</strong>
                                        </div>
                                        <p>Hand-stitched with care. We never rush quality.</p>
                                    </div>
                                    <div className="fit-assurance-card">
                                        <span className="badge-fit">🛡️ Fit & Flare Fit Guarantee</span>
                                        <p>Don't worry about the fit! If it isn't perfect, we'll alter it for free.</p>
                                    </div>
                                </div>

                                <div className="confirmation-box">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={confirmed}
                                            onChange={(e) => setConfirmed(e.target.checked)}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="text">I confirm design & measurements. Design is locked upon payment.</span>
                                    </label>
                                </div>

                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={!confirmed}
                                    onClick={() => navigate('/checkout/payment')}
                                >
                                    Lock Design & Pay ₹{total}
                                </button>
                                <p className="secure-note">🔒 Secure Checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewOrder;

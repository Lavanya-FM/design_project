import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/OrderTracking.css';

const OrderTracking = () => {
    const navigate = useNavigate();
    const [showAlterationModal, setShowAlterationModal] = useState(false);
    const [alterationNote, setAlterationNote] = useState('');
    const [alterationType, setAlterationType] = useState('fit');

    const order = {
        id: 'FF-2401',
        total: 3200,
        designName: 'Royal Zardosi Silk — Deep U Neck',
        status: 'Stitching In-Progress',
        placedDate: '01 Feb 2026',
        estimatedDelivery: '14 Feb 2026',
        tailor: 'Master Ramesh',
        fabric: 'Raw Silk (Deep Red)',
        steps: [
            { name: 'Order Confirmed', status: 'completed', date: '01 Feb', icon: '✓', desc: 'Payment received, order confirmed.' },
            { name: 'Tailor Assigned', status: 'completed', date: '01 Feb', icon: '👤', desc: 'Master Ramesh has been assigned.' },
            { name: 'Fabric Dispatched', status: 'completed', date: '02 Feb', icon: '📦', desc: 'Raw Silk (Deep Red) dispatched from vendor.' },
            { name: 'Cutting & Prep', status: 'completed', date: '04 Feb', icon: '✂️', desc: 'Pattern cutting completed.' },
            { name: 'Stitching In Progress', status: 'active', date: 'Est: 08 Feb', icon: '🧵', desc: 'Front panels and side seams being stitched.' },
            { name: 'Quality Check', status: 'pending', date: '', icon: '🔍', desc: 'Final QC and measurement verification.' },
            { name: 'Shipped', status: 'pending', date: '', icon: '🚚', desc: 'Shipped via partner courier.' },
            { name: 'Delivered', status: 'pending', date: '', icon: '🎉', desc: 'Delivered to your doorstep!' },
        ],
        liveFeed: [
            { time: '2 hours ago', author: 'Master Ramesh', message: 'Front panel stitching completed. Starting embroidery placement now.', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
            { time: '6 hours ago', author: 'Quality Team', message: 'Fabric quality verified — no defects. Approved for cutting.', image: null },
            { time: '1 day ago', author: 'Master Ramesh', message: 'Pattern marked and cutting started. Following 14" sleeve length spec.', image: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=400' },
        ],
        designSummary: {
            neck: 'Deep U Neck',
            sleeve: 'Elbow Length (14")',
            back: 'Keyhole Back',
            fabric: 'Raw Silk (Deep Red)',
            work: 'Hand Zardosi + Antique Beads',
            lining: 'Crepe Lining',
        }
    };

    const handleAlterationSubmit = () => {
        alert(`Alteration request submitted!\nType: ${alterationType}\nDetails: ${alterationNote}`);
        setShowAlterationModal(false);
        setAlterationNote('');
    };

    const activeStepIndex = order.steps.findIndex(s => s.status === 'active');
    const progressPct = Math.round(((activeStepIndex + 0.5) / order.steps.length) * 100);

    return (
        <>
            <Navbar />
            <div className="page-container tracking-page">
                <div className="container">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <Link to="/dashboard">My Account</Link>
                        <span>/</span>
                        <Link to="/dashboard">Orders</Link>
                        <span>/</span>
                        <span className="active">#{order.id}</span>
                    </nav>

                    {/* Order Header */}
                    <div className="tracking-header-card">
                        <div className="th-left">
                            <h1>Order #{order.id}</h1>
                            <p className="th-design-name">{order.designName}</p>
                            <div className="th-meta">
                                <span>📅 Placed: {order.placedDate}</span>
                                <span>🚚 Est. Delivery: <strong>{order.estimatedDelivery}</strong></span>
                                <span>👤 Tailor: {order.tailor}</span>
                            </div>
                        </div>
                        <div className="th-right">
                            <span className="status-live-badge">
                                <span className="pulse-dot"></span>
                                {order.status}
                            </span>
                            <span className="th-total">₹{order.total}</span>
                        </div>
                    </div>

                    {/* Global Progress */}
                    <div className="tracking-progress-bar">
                        <div className="tracking-pbar-track">
                            <div className="tracking-pbar-fill" style={{ width: `${progressPct}%` }}></div>
                        </div>
                        <span className="tracking-pbar-label">{progressPct}% Complete</span>
                    </div>

                    {/* Timeline */}
                    <div className="tracking-timeline">
                        {order.steps.map((step, index) => (
                            <div key={index} className={`tl-step tl-${step.status}`}>
                                <div className="tl-dot-wrap">
                                    <div className="tl-dot">{step.status === 'completed' ? '✓' : step.icon}</div>
                                    {index < order.steps.length - 1 && <div className="tl-connector"></div>}
                                </div>
                                <div className="tl-content">
                                    <h4>{step.name}</h4>
                                    <p>{step.desc}</p>
                                    {step.date && <span className="tl-date">{step.date}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="tracking-details-grid">
                        {/* Design Summary */}
                        <div className="td-card">
                            <h3>👗 Design Summary</h3>
                            <div className="summary-detail-list">
                                {Object.entries(order.designSummary).map(([key, val]) => (
                                    <div key={key} className="sd-item">
                                        <span className="sd-key">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                        <span className="sd-val">{val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="design-preview-row">
                                <img src="https://images.unsplash.com/photo-1594938298603-c8148c47e957?w=300" alt="Front View" />
                                <img src="https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=300" alt="Back View" />
                            </div>
                        </div>

                        {/* Live Work Feed */}
                        <div className="td-card feed-card">
                            <h3>📸 Live Work Feed</h3>
                            <div className="live-feed">
                                {order.liveFeed.map((item, i) => (
                                    <div key={i} className="feed-item">
                                        <span className="feed-time">{item.time}</span>
                                        <div className="feed-body">
                                            <p><strong>{item.author}:</strong> "{item.message}"</p>
                                            {item.image && (
                                                <img src={item.image} alt="Progress" className="feed-img" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="td-card actions-card">
                            <h3>🛠️ Need Help?</h3>
                            <p className="actions-desc">Contact us for any changes or issues with your order.</p>
                            <div className="action-buttons">
                                <button className="btn btn-outline btn-block" onClick={() => navigate('/dashboard')}>📋 View All Orders</button>
                                <button className="btn btn-outline btn-block">💬 Chat with Support</button>
                                <button className="btn btn-primary btn-block" onClick={() => setShowAlterationModal(true)}>✏️ Request Alteration</button>
                            </div>
                            <div className="alteration-info">
                                <p>🛡️ Post-delivery alterations are <strong>free</strong> within 7 days.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alteration Modal */}
            {showAlterationModal && (
                <div className="modal-overlay" onClick={() => setShowAlterationModal(false)}>
                    <div className="modal-card alteration-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Request Alteration</h3>
                            <button className="modal-close" onClick={() => setShowAlterationModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Alteration Type</label>
                                <div className="alteration-type-options">
                                    {[
                                        { id: 'fit', label: '📏 Fit Issue', desc: 'Too tight or loose' },
                                        { id: 'design', label: '🎨 Design Mismatch', desc: 'Differs from what was ordered' },
                                        { id: 'quality', label: '🔍 Quality Issue', desc: 'Stitching defect or damage' },
                                        { id: 'other', label: '📝 Other', desc: 'Different concern' },
                                    ].map(opt => (
                                        <div
                                            key={opt.id}
                                            className={`alt-type-card ${alterationType === opt.id ? 'selected' : ''}`}
                                            onClick={() => setAlterationType(opt.id)}
                                        >
                                            <span>{opt.label}</span>
                                            <p>{opt.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Describe the Issue</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Please describe what needs to be altered..."
                                    value={alterationNote}
                                    onChange={(e) => setAlterationNote(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Upload Photo (Optional)</label>
                                <div className="upload-zone-small">
                                    <span>📷</span>
                                    <p>Click to upload</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowAlterationModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAlterationSubmit} disabled={!alterationNote.trim()}>Submit Request</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default OrderTracking;

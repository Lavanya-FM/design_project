import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CONFIG from '../config';
import '../styles/OrderTracking.css';

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [showAlterationModal, setShowAlterationModal] = useState(false);
    const [alterationNote, setAlterationNote] = useState('');
    const [alterationType, setAlterationType] = useState('fit');

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const res = await axios.get(`${CONFIG.API_URL}/orders/${id}`);
                const data = res.data;
                
                // Map API status to step status
                const statusMap = {
                    'placed': 0,
                    'accepted': 1,
                    'stitching': 4,
                    'in_production': 4,
                    'ready': 5,
                    'quality_check': 5,
                    'shipped': 6,
                    'delivered': 7
                };

                const currentStepIndex = statusMap[data.status] || 0;

                const steps = [
                    { name: 'Order Confirmed', icon: '✓', desc: 'Payment received, order confirmed.' },
                    { name: 'Tailor Assigned', icon: '👤', desc: `${data.tailor_name || 'Artisan'} has been assigned.` },
                    { name: 'Fabric Dispatched', icon: '📦', desc: 'Fabric dispatched from vendor.' },
                    { name: 'Cutting & Prep', icon: '✂️', desc: 'Pattern cutting completed.' },
                    { name: 'Stitching In Progress', icon: '🧵', desc: 'Front panels and side seams being stitched.' },
                    { name: 'Quality Check', icon: '🔍', desc: 'Final QC and measurement verification.' },
                    { name: 'Shipped', icon: '🚚', desc: 'Shipped via partner courier.' },
                    { name: 'Delivered', icon: '🎉', desc: 'Delivered to your doorstep!' },
                ].map((step, idx) => ({
                    ...step,
                    status: idx < currentStepIndex ? 'completed' : idx === currentStepIndex ? 'active' : 'pending',
                    date: idx <= currentStepIndex ? (idx === 0 ? new Date(data.created_at).toLocaleDateString() : '') : ''
                }));

                const firstItem = data.items?.[0] || {};
                const designSummary = firstItem.customization_details || {};
                
                setOrder({
                    id: data.id,
                    total: data.total_amount,
                    designName: firstItem.design_name || 'Custom Blouse',
                    status: data.status.charAt(0).toUpperCase() + data.status.slice(1).replace('_', ' '),
                    placedDate: new Date(data.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    estimatedDelivery: data.deadline ? new Date(data.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending',
                    tailor: data.tailor_name || 'Not assigned',
                    fabric: designSummary.fabric || 'Selected Fabric',
                    steps: steps,
                    liveFeed: (data.history || []).map(h => ({
                        time: new Date(h.created_at).toLocaleString(),
                        author: h.changed_by_name || 'System',
                        message: h.comments || `Status updated to ${h.new_status}`,
                        image: null
                    })),
                    designSummary: designSummary,
                    images: [firstItem.design_image || 'https://via.placeholder.com/300']
                });
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [id]);

    useEffect(() => {
        const socket = io(CONFIG.API_URL.replace('/api', ''), {
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('join_order', id);
        });

        socket.on('status_update', (data) => {
            console.log('Live status update received:', data);
            if (data.orderId === id) {
                // Trigger a refresh or manually update state
                // Refreshing is safer to get full updated object including history
                window.location.reload(); 
                // Alternatively, find the step and update it if you want zero-refresh UI
            }
        });

        socket.on('new_message', (message) => {
            if (message.order_id === id) {
                setOrder(prev => ({
                    ...prev,
                    liveFeed: [
                        {
                            time: new Date(message.created_at).toLocaleString(),
                            author: 'Artisan',
                            message: message.message_text,
                            image: message.attachment_url
                        },
                        ...prev.liveFeed
                    ]
                }));
            }
        });

        return () => socket.disconnect();
    }, [id]);

    const handleAlterationSubmit = () => {
        alert(`Alteration request submitted!\nType: ${alterationType}\nDetails: ${alterationNote}`);
        setShowAlterationModal(false);
        setAlterationNote('');
    };

    if (loading) return <div className="loading-state">Loading your order details...</div>;
    if (!order) return <div className="error-state">Order not found. <Link to="/dashboard">Back to Dashboard</Link></div>;

    const activeStepIndex = order.steps.findIndex(s => s.status === 'active');
    const progressPct = activeStepIndex === -1 && order.steps.every(s => s.status === 'completed') 
        ? 100 
        : Math.round(((activeStepIndex === -1 ? 0 : activeStepIndex + 0.5) / order.steps.length) * 100);

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
                                {order.images.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Preview ${idx}`} />
                                ))}
                            </div>
                        </div>

                        {/* Live Work Feed */}
                        <div className="td-card feed-card">
                            <h3>📸 Status Updates</h3>
                            <div className="live-feed">
                                {order.liveFeed.length > 0 ? order.liveFeed.map((item, i) => (
                                    <div key={i} className="feed-item">
                                        <span className="feed-time">{item.time}</span>
                                        <div className="feed-body">
                                            <p><strong>{item.author}:</strong> "{item.message}"</p>
                                            {item.image && (
                                                <img src={item.image} alt="Progress" className="feed-img" />
                                            )}
                                        </div>
                                    </div>
                                )) : <p style={{color: '#999', fontStyle: 'italic'}}>No updates yet.</p>}
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
                                <div className="upload-zone-small" style={{minHeight: '100px'}}>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/TailorDashboard.css';

const MOCK_ORDERS = [
    {
        id: 'FF-2401', customer: 'Priya Sharma', design: 'Royal Zardosi Silk',
        status: 'cutting', fabric: 'Raw Silk (Deep Red)', deadline: '2026-02-15',
        priority: 'high',
        measurements: { bust: 36, waist: 30, shoulder: 14.5, armhole: 16, length: 15, sleeveLength: 8 },
        customizations: { neck: 'Deep U', sleeve: 'Elbow Length', back: 'Keyhole', cut: 'Princess Cut', lining: 'Crepe' },
        instructions: 'Customer wants extra margin at side seams for future adjustments. Lining must match silk shade.',
        image: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=600',
        progress: [
            { step: 'Fabric Received', done: true, date: '03 Feb' },
            { step: 'Pattern Cut', done: true, date: '04 Feb' },
            { step: 'Stitching Body', done: false, date: '' },
            { step: 'Sleeves & Finishing', done: false, date: '' },
            { step: 'Quality Inspection', done: false, date: '' },
        ]
    },
    {
        id: 'FF-2402', customer: 'Anjali Menon', design: 'Lace Overlay Sweetheart',
        status: 'stitching', fabric: 'Net/Lace (Ivory)', deadline: '2026-02-18',
        priority: 'medium',
        measurements: { bust: 34, waist: 28, shoulder: 14, armhole: 15, length: 14, sleeveLength: 12 },
        customizations: { neck: 'Sweetheart', sleeve: 'Elbow Length', back: 'Deep Round', cut: 'Darted', lining: 'Cotton' },
        instructions: 'Delicate lace — handle with care. Pearl border must be hand-stitched.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c47e957?w=600',
        progress: [
            { step: 'Fabric Received', done: true, date: '05 Feb' },
            { step: 'Pattern Cut', done: true, date: '06 Feb' },
            { step: 'Stitching Body', done: true, date: '08 Feb' },
            { step: 'Sleeves & Finishing', done: false, date: '' },
            { step: 'Quality Inspection', done: false, date: '' },
        ]
    },
    {
        id: 'FF-2398', customer: 'Kavitha R.', design: 'Minimalist Boat Neck',
        status: 'qc-ready', fabric: 'Brocade (Gold)', deadline: '2026-02-12',
        priority: 'low',
        measurements: { bust: 32, waist: 26, shoulder: 13, armhole: 15, length: 14, sleeveLength: 0 },
        customizations: { neck: 'Boat Neck', sleeve: 'Sleeveless', back: 'Deep Round', cut: 'Darted', lining: 'Cotton' },
        instructions: 'Simple finish. No hooks — side zip requested.',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
        progress: [
            { step: 'Fabric Received', done: true, date: '01 Feb' },
            { step: 'Pattern Cut', done: true, date: '02 Feb' },
            { step: 'Stitching Body', done: true, date: '04 Feb' },
            { step: 'Sleeves & Finishing', done: true, date: '06 Feb' },
            { step: 'Quality Inspection', done: false, date: '' },
        ]
    }
];

const STATUS_MAP = {
    'cutting': { label: 'Cutting', color: '#F39C12', bg: '#FFF8E7' },
    'stitching': { label: 'Stitching', color: '#3498DB', bg: '#EBF5FB' },
    'qc-ready': { label: 'QC Ready', color: '#27AE60', bg: '#E8F8EF' },
    'on-hold': { label: 'On Hold', color: '#E74C3C', bg: '#FFEBEE' },
};

const TailorDashboard = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [updateNote, setUpdateNote] = useState('');

    const filteredOrders = MOCK_ORDERS.filter(o => {
        if (activeTab === 'active') return o.status !== 'qc-ready';
        if (activeTab === 'ready') return o.status === 'qc-ready';
        return true;
    });

    const handleProgressUpload = () => {
        alert('Progress image uploaded! Customer will be notified.');
        setUploadPreview(null);
        setUpdateNote('');
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        alert(`Order ${orderId} status updated to: ${newStatus}`);
    };

    return (
        <>
            <Navbar />
            <div className="tailor-dashboard">
                {/* Sidebar */}
                <aside className="tailor-sidebar">
                    <div className="sidebar-brand">
                        <span className="brand-icon">✂️</span>
                        <h2>Tailor Station</h2>
                        <span className="station-id">Master Ji</span>
                    </div>

                    <nav className="sidebar-nav">
                        <button className={`nav-item ${activeTab === 'active' ? 'active' : ''}`} onClick={() => { setActiveTab('active'); setSelectedOrder(null); }}>
                            <span>🧵</span> Active Jobs
                            <span className="nav-badge">{MOCK_ORDERS.filter(o => o.status !== 'qc-ready').length}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'ready' ? 'active' : ''}`} onClick={() => { setActiveTab('ready'); setSelectedOrder(null); }}>
                            <span>✅</span> QC Ready
                            <span className="nav-badge">{MOCK_ORDERS.filter(o => o.status === 'qc-ready').length}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => { setActiveTab('all'); setSelectedOrder(null); }}>
                            <span>📋</span> All Orders
                        </button>
                    </nav>

                    {/* Stats */}
                    <div className="sidebar-stats">
                        <div className="stat-card">
                            <span className="stat-val">3</span>
                            <span className="stat-label">Active Jobs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-val" style={{ color: '#27AE60' }}>12</span>
                            <span className="stat-label">This Month</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-val" style={{ color: '#F39C12' }}>1</span>
                            <span className="stat-label">Overdue</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="tailor-main">
                    {!selectedOrder ? (
                        <>
                            <div className="main-header">
                                <h1>{activeTab === 'active' ? 'Active Jobs' : activeTab === 'ready' ? 'Ready for QC' : 'All Orders'}</h1>
                                <p>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</p>
                            </div>

                            <div className="orders-list-tailor">
                                {filteredOrders.map(order => {
                                    const statusInfo = STATUS_MAP[order.status] || STATUS_MAP['cutting'];
                                    const daysLeft = Math.ceil((new Date(order.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <div key={order.id} className="tailor-order-card" onClick={() => setSelectedOrder(order)}>
                                            <div className="order-thumb">
                                                <img src={order.image} alt={order.design} />
                                            </div>
                                            <div className="order-info">
                                                <div className="order-top-row">
                                                    <span className="order-id">#{order.id}</span>
                                                    <span className="status-pill" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <h3>{order.design}</h3>
                                                <p className="order-customer">👤 {order.customer}</p>
                                                <div className="order-meta-row">
                                                    <span>🧵 {order.fabric}</span>
                                                    <span className={`deadline ${daysLeft <= 2 ? 'urgent' : ''}`}>
                                                        ⏰ {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue!'}
                                                    </span>
                                                </div>
                                                {/* Progress mini bar */}
                                                <div className="mini-progress">
                                                    {order.progress.map((step, i) => (
                                                        <div key={i} className={`mini-dot ${step.done ? 'done' : ''}`} title={step.step}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        /* ORDER DETAIL VIEW */
                        <div className="order-detail-view">
                            <button className="back-btn" onClick={() => setSelectedOrder(null)}>← Back to Orders</button>

                            <div className="detail-header">
                                <h1>Order #{selectedOrder.id}</h1>
                                <span className="status-pill" style={{
                                    background: STATUS_MAP[selectedOrder.status]?.bg,
                                    color: STATUS_MAP[selectedOrder.status]?.color
                                }}>
                                    {STATUS_MAP[selectedOrder.status]?.label}
                                </span>
                            </div>

                            <div className="detail-grid">
                                {/* Design Reference */}
                                <div className="detail-card design-ref-card">
                                    <h3>📸 Design Reference</h3>
                                    <img src={selectedOrder.image} alt="Design" className="ref-image" />
                                    <h4>{selectedOrder.design}</h4>
                                    <p>Customer: <strong>{selectedOrder.customer}</strong></p>
                                </div>

                                {/* Measurements */}
                                <div className="detail-card">
                                    <h3>📏 Measurements (Inches)</h3>
                                    <div className="measurements-detail-grid">
                                        {Object.entries(selectedOrder.measurements).map(([key, val]) => (
                                            <div key={key} className="m-detail-tile">
                                                <span className="m-key">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="m-value">{val}"</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customizations */}
                                <div className="detail-card">
                                    <h3>🎨 Customization Details</h3>
                                    <div className="custom-detail-list">
                                        {Object.entries(selectedOrder.customizations).map(([key, val]) => (
                                            <div key={key} className="custom-item">
                                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                <strong>{val}</strong>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="fabric-info">
                                        <span>Fabric:</span>
                                        <strong>{selectedOrder.fabric}</strong>
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                <div className="detail-card instructions-card">
                                    <h3>📝 Special Instructions</h3>
                                    <p>{selectedOrder.instructions}</p>
                                </div>

                                {/* Progress Tracker */}
                                <div className="detail-card progress-card">
                                    <h3>📊 Stitching Progress</h3>
                                    <div className="progress-timeline">
                                        {selectedOrder.progress.map((step, i) => (
                                            <div key={i} className={`timeline-step ${step.done ? 'completed' : ''}`}>
                                                <div className="step-marker">{step.done ? '✓' : (i + 1)}</div>
                                                <div className="step-content">
                                                    <span className="step-name">{step.step}</span>
                                                    {step.date && <span className="step-date">{step.date}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Upload Progress */}
                                <div className="detail-card upload-card">
                                    <h3>📸 Upload Progress Photo</h3>
                                    <p className="upload-desc">Share live stitching updates with the customer.</p>
                                    <div className="upload-zone" onClick={() => document.getElementById('tailor-upload').click()}>
                                        <input type="file" id="tailor-upload" hidden onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setUploadPreview(URL.createObjectURL(file));
                                        }} />
                                        {uploadPreview ? (
                                            <img src={uploadPreview} alt="Preview" className="upload-preview" />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <span>📷</span>
                                                <p>Click to upload photo</p>
                                            </div>
                                        )}
                                    </div>
                                    <textarea
                                        className="form-input update-note"
                                        placeholder="Add a note for the customer (e.g., 'Front panels stitched, starting embroidery...')"
                                        value={updateNote}
                                        onChange={(e) => setUpdateNote(e.target.value)}
                                    />
                                    <button className="btn btn-primary btn-block" onClick={handleProgressUpload}>
                                        📤 Send Update to Customer
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="detail-actions">
                                <button className="btn btn-primary" onClick={() => handleStatusUpdate(selectedOrder.id, 'Next Stage')}>
                                    ✅ Mark Current Step Done
                                </button>
                                <button className="btn btn-outline" style={{ borderColor: '#E74C3C', color: '#E74C3C' }}>
                                    ⚠️ Report Issue
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default TailorDashboard;

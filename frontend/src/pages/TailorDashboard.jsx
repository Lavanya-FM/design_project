import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CONFIG from '../config';
import OrdersList from '../features/tailor/OrdersList';
import OrderDetail from '../features/tailor/OrderDetail';
import '../styles/TailorDashboard.css';

const STATUS_MAP = {
    'draft': { label: 'Draft', color: '#7f8c8d', bg: '#ecf0f1' },
    'placed': { label: 'Cutting', color: '#F39C12', bg: '#FFF8E7' },
    'accepted': { label: 'Stitching', color: '#3498DB', bg: '#EBF5FB' },
    'quality_check': { label: 'QC Ready', color: '#27AE60', bg: '#E8F8EF' },
    'on-hold': { label: 'On Hold', color: '#E74C3C', bg: '#FFEBEE' },
};

const TailorDashboard = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [updateNote, setUpdateNote] = useState('');
    const [orders, setOrders] = useState([]);
    const [isAvailable, setIsAvailable] = useState(true);

    const toggleAvailability = async () => {
        try {
            await axios.post(`${CONFIG.API_URL}/fulfillment/availability`, { isAvailable: !isAvailable }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsAvailable(!isAvailable);
            alert(`Availability updated to: ${!isAvailable ? 'Busy' : 'Available'}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update availability.');
        }
    };

    const handleProgressUpload = async () => {
        if (!selectedOrder) return;
        try {
            const payload = {
                text: updateNote,
                attachment: uploadPreview
            };
            await axios.post(`${CONFIG.API_URL}/fulfillment/${selectedOrder.id}/messages`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Progress update sent to customer!');
            setUploadPreview(null);
            setUpdateNote('');
        } catch (err) {
            console.error("Failed to send update:", err);
            alert('Failed to send update.');
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const statusMap = {
                'Next Stage': 'stitching',
                'QC Ready': 'quality_check',
                'Mark Current Step Done': 'ready'
            };
            const status = statusMap[newStatus] || newStatus;

            await axios.patch(`${CONFIG.API_URL}/fulfillment/${orderId}/status`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            const res = await axios.get(`${CONFIG.API_URL}/orders`);
            setOrders(res.data);
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(null);
            }
            alert(`Order status updated successfully.`);
        } catch (err) {
            console.error("Update failed:", err);
            alert('Failed to update status.');
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${CONFIG.API_URL}/orders`);
                const fetchedOrders = res.data.map(o => ({
                    ...o,
                    progress: [
                        { step: 'Fabric Received', done: o.status !== 'draft' && o.status !== 'placed', date: '' },
                        { step: 'Pattern Cut', done: o.status !== 'draft' && o.status !== 'placed', date: '' },
                        { step: 'Stitching Body', done: o.status === 'quality_check', date: '' },
                        { step: 'Sleeves & Finishing', done: o.status === 'quality_check', date: '' },
                        { step: 'Quality Inspection', done: false, date: '' },
                    ],
                    measurements: o.measurements || { bust: 36, waist: 30, shoulder: 14 },
                    customizations: o.customizations || { neck: 'Deep U', sleeve: 'Short' },
                    fabric: o.fabric || 'Raw Silk',
                    deadline: o.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    design: o.design || 'Custom Blouse',
                    image: o.image || 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=600'
                }));
                setOrders(fetchedOrders);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        if (activeTab === 'active') return o.status !== 'quality_check';
        if (activeTab === 'ready') return o.status === 'quality_check';
        return true;
    });

    return (
        <>
            <Navbar />
            <div className="tailor-dashboard">
                <aside className="tailor-sidebar">
                    <div className="sidebar-brand">
                        <span className="brand-icon">✂️</span>
                        <h2>Tailor Station</h2>
                        <span className="station-id">Master Ji</span>
                    </div>

                    <div className="availability-section" style={{ padding: '0 20px 20px' }}>
                        <div className="availability-toggle" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                            <span className={`status-dot ${isAvailable ? 'online' : 'offline'}`} style={{ width: '10px', height: '10px', borderRadius: '50%', background: isAvailable ? '#27ae60' : '#e74c3c' }}></span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{isAvailable ? 'Available' : 'Busy'}</span>
                            <button 
                                onClick={toggleAvailability}
                                style={{ marginLeft: 'auto', padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }}
                            >
                                Toggle
                            </button>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <button className={`nav-item ${activeTab === 'active' ? 'active' : ''}`} onClick={() => { setActiveTab('active'); setSelectedOrder(null); }}>
                            <span>🧵</span> Active Jobs
                            <span className="nav-badge">{orders.filter(o => o.status !== 'quality_check').length}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'ready' ? 'active' : ''}`} onClick={() => { setActiveTab('ready'); setSelectedOrder(null); }}>
                            <span>✅</span> QC Ready
                            <span className="nav-badge">{orders.filter(o => o.status === 'quality_check').length}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => { setActiveTab('all'); setSelectedOrder(null); }}>
                            <span>📋</span> All Orders
                        </button>
                    </nav>

                    <div className="sidebar-stats">
                        <div className="stat-card">
                            <span className="stat-val">{orders.filter(o => o.status !== 'quality_check').length}</span>
                            <span className="stat-label">Active Jobs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-val" style={{ color: '#27AE60' }}>{orders.filter(o => o.status === 'quality_check').length}</span>
                            <span className="stat-label">QC Ready</span>
                        </div>
                    </div>
                </aside>

                <main className="tailor-main">
                    {!selectedOrder ? (
                        <>
                            <div className="main-header">
                                <h1>{activeTab === 'active' ? 'Active Jobs' : activeTab === 'ready' ? 'Ready for QC' : 'All Orders'}</h1>
                                <p>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</p>
                            </div>

                            <OrdersList 
                                orders={filteredOrders} 
                                activeTab={activeTab} 
                                setSelectedOrder={setSelectedOrder} 
                                STATUS_MAP={STATUS_MAP} 
                            />
                        </>
                    ) : (
                        <OrderDetail 
                            selectedOrder={selectedOrder}
                            setSelectedOrder={setSelectedOrder}
                            STATUS_MAP={STATUS_MAP}
                            uploadPreview={uploadPreview}
                            setUploadPreview={setUploadPreview}
                            updateNote={updateNote}
                            setUpdateNote={setUpdateNote}
                            handleProgressUpload={handleProgressUpload}
                            handleStatusUpdate={handleStatusUpdate}
                        />
                    )}
                </main>
            </div>
        </>
    );
};

export default TailorDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../config';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';
import '../styles/Operational.css';
import { useSocket } from '../components/SocketContext';

// --- MOCK DATA FOR DEMO ---
const TAILORS = [
    { id: 't1', name: 'Master Ramesh', specialty: 'Bridal', load: 85, jobs: 12 },
    { id: 't2', name: 'Master Sunil', specialty: 'Designer V-Neck', load: 40, jobs: 5 },
    { id: 't3', name: 'Master Anita', specialty: 'Embroidery', load: 10, jobs: 1 },
    { id: 't4', name: 'Master Jatin', specialty: 'Classic Cuts', load: 65, jobs: 9 },
];

const ALTERATIONS = [
    { id: 'alt_101', orderId: 'FF-2401', customer: 'Lavanya', type: 'Fit Issue', desc: 'Sleeves are 0.5 inch too tight.', status: 'pending', date: ' Feb 08', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const socket = useSocket();
    const [activeTab, setActiveTab] = useState('cockpit');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [designs, setDesigns] = useState([]);
    const [liveStream, setLiveStream] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_role', 'ADMIN');

        socket.on('admin_update', (data) => {
            console.log("Real-time Admin Ping:", data);
            showToast(`LIVE: ${data.payload.message}`, 'info');
            setLiveStream(prev => [{
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                msg: data.payload.message
            }, ...prev].slice(0, 5));
        });

        return () => {
            socket.off('admin_update');
        };
    }, [socket]);

    // UI States
    const [selectedTailor, setSelectedTailor] = useState(null);
    const [assignModal, setAssignModal] = useState(null); // stores orderId

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, designsRes] = await Promise.all([
                    axios.get(`${CONFIG.API_URL}/orders`).catch(() => ({ data: [] })),
                    axios.get(`${CONFIG.API_URL}/designs`).catch(() => ({ data: [] }))
                ]);
                setOrders(ordersRes.data);
                setDesigns(designsRes.data);
            } catch (err) {
                console.error("Admin fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssign = (orderId, tailorId) => {
        showToast(`Order ${orderId} assigned to ${TAILORS.find(t => t.id === tailorId).name}`, 'success');
        setAssignModal(null);
    };

    const handleAlteration = (id, action) => {
        showToast(`Alteration ${id} ${action === 'approve' ? 'Approved' : 'Rejected'}`, action === 'approve' ? 'success' : 'info');
    };

    return (
        <div className="admin-dashboard">
            <Navbar />

            <header className="admin-header">
                <h2>Fit & Flare Operations Control</h2>
                <div className="admin-tabs">
                    <button className={`admin-tab ${activeTab === 'cockpit' ? 'active' : ''}`} onClick={() => setActiveTab('cockpit')}>Cockpit</button>
                    <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Order Manager</button>
                    <button className={`admin-tab ${activeTab === 'tailors' ? 'active' : ''}`} onClick={() => setActiveTab('tailors')}>Tailor Hub</button>
                    <button className={`admin-tab ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => setActiveTab('disputes')}>Alterations</button>
                    <button className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Design Studio</button>
                </div>
            </header>

            <main className="admin-content container">
                {activeTab === 'cockpit' && (
                    <div className="animate-me">
                        <section className="op-stats-grid">
                            <div className="op-stat-card primary">
                                <h4>Today's Revenue</h4>
                                <div className="op-stat-val">₹42,500</div>
                                <p style={{ fontSize: '0.75rem', color: '#27AE60', marginTop: '4px' }}>↑ 12% from yesterday</p>
                            </div>
                            <div className="op-stat-card success">
                                <h4>Jobs in Stitching</h4>
                                <div className="op-stat-val">24</div>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>Across 8 tailors</p>
                            </div>
                            <div className="op-stat-card warning">
                                <h4>Pending Assignment</h4>
                                <div className="op-stat-val">5</div>
                                <p style={{ fontSize: '0.75rem', color: '#D02F44', marginTop: '4px' }}>Needs attention</p>
                            </div>
                            <div className="op-stat-card">
                                <h4>QC Ready</h4>
                                <div className="op-stat-val">8</div>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>Final verification</p>
                            </div>
                        </section>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                            <div className="admin-table-wrap">
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ fontSize: '1rem' }}>Critical Deliveries (Next 48h)</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#D02F44' }}>5 Urgent</span>
                                </div>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                            <th>Deadline</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { id: 'FF-2401', user: 'Lavanya P.', status: 'Stitching', date: 'Tomorrow' },
                                            { id: 'FF-2405', user: 'Sneha R.', status: 'Fabric Sourced', date: 'Feb 12' },
                                            { id: 'FF-2398', user: 'Anjali M.', status: 'QC Pending', date: 'Today' },
                                        ].map(o => (
                                            <tr key={o.id}>
                                                <td><strong>#{o.id}</strong></td>
                                                <td>{o.user}</td>
                                                <td><span className={`status-pill ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                                                <td>{o.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="dash-card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Live Engagement Stream</h3>
                                <div className="live-stream-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {liveStream.length === 0 && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Waiting for user signals...</p>}
                                    {liveStream.map(stream => (
                                        <div key={stream.id} className="stream-item" style={{ borderLeft: '3px solid #D02F44', paddingLeft: '12px', background: '#fdfaf5', padding: '8px 12px', borderRadius: '4px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{stream.time}</span>
                                                <span style={{ fontSize: '0.6rem', color: '#D02F44', fontWeight: 900 }}>TRENDING</span>
                                            </div>
                                            <p style={{ fontSize: '0.78rem', margin: 0, fontWeight: 600 }}>{stream.msg}</p>
                                        </div>
                                    ))}
                                </div>

                                <h3 style={{ fontSize: '1rem', margin: '32px 0 16px' }}>Network Status</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { label: 'Tailor Studio', status: 'Online', color: '#27AE60' },
                                        { label: 'Fabric Merchants', status: '8 Active', color: '#27AE60' },
                                        { label: 'Payment Gateway', status: 'Operational', color: '#27AE60' },
                                        { label: 'Delivery Partner', status: 'High Volume', color: '#F39C12' },
                                    ].map((s, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</span>
                                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: `${s.color}15`, color: s.color, fontWeight: 700 }}>{s.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="animate-me">
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Style</th>
                                        <th>Status</th>
                                        <th>Tailor</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(orders.length ? orders : [
                                        { id: 'FF-2401', style: 'Bridal Deep U', status: 'Unassigned', total: 3500 },
                                        { id: 'FF-2405', style: 'Velvet Sweetheart', status: 'Assigned', tailor: 'Master Ramesh', total: 4200 },
                                    ]).map(order => (
                                        <tr key={order.id}>
                                            <td><strong>#{order.id}</strong></td>
                                            <td>{order.style || 'Custom Design'}</td>
                                            <td><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                            <td>{order.tailor || 'Not Assigned'}</td>
                                            <td>₹{order.total}</td>
                                            <td>
                                                <button className="btn btn-outline btn-sm" onClick={() => setAssignModal(order.id)}>Assign Tailor</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'tailors' && (
                    <div className="animate-me">
                        <div className="tailor-list-card">
                            {TAILORS.map(tailor => (
                                <div key={tailor.id} className="tailor-item">
                                    <div className="tailor-avatar">{tailor.name.charAt(0)}</div>
                                    <div className="tailor-info">
                                        <h4>{tailor.name}</h4>
                                        <p>{tailor.specialty} Specialist • {tailor.jobs} Active Jobs</p>
                                    </div>
                                    <div className="tailor-load">
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{tailor.load}% Capacity</span>
                                        <div className="load-bar-wrap">
                                            <div className="load-bar-fill" style={{ width: `${tailor.load}%`, background: tailor.load > 80 ? '#D02F44' : '#27AE60' }}></div>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline btn-sm">View Jobs</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'disputes' && (
                    <div className="animate-me">
                        {ALTERATIONS.map(alt => (
                            <div key={alt.id} className="dispute-card">
                                <div className="dispute-meta">
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D02F44' }}>ALTERATION REQUEST</span>
                                    <h3 style={{ margin: '8px 0' }}>Order #{alt.orderId}</h3>
                                    <p style={{ fontSize: '0.88rem', color: '#666' }}>Customer: <strong>{alt.customer}</strong></p>
                                    <p style={{ fontSize: '0.88rem', color: '#666' }}>Issue: {alt.type}</p>
                                    <p style={{ fontSize: '0.82rem', marginTop: '12px', background: '#f8f8f8', padding: '12px', borderRadius: '8px', fontStyle: 'italic' }}>
                                        "{alt.desc}"
                                    </p>
                                </div>
                                <div className="dispute-content">
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4>Client Image Reference</h4>
                                            <img src={alt.img} className="dispute-img" alt="Dispute" />
                                        </div>
                                        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                                            <button className="btn btn-primary btn-block" onClick={() => handleAlteration(alt.id, 'approve')}>Approve Free Alteration</button>
                                            <button className="btn btn-outline btn-block" onClick={() => handleAlteration(alt.id, 'reject')}>Discuss with Client</button>
                                            <p style={{ fontSize: '0.72rem', color: '#999', textAlign: 'center' }}>
                                                Approved alterations trigger a merchant fabric request and tailor assignment.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="animate-me">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h3>Master Catalog</h3>
                            <button className="btn btn-primary btn-sm">+ Add New Design</button>
                        </div>
                        <div className="op-stats-grid">
                            {designs.slice(0, 8).map(d => (
                                <div key={d.id} className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <img src={d.image} style={{ width: '100%', height: '140px', objectFit: 'cover' }} alt={d.name} />
                                    <div style={{ padding: '12px' }}>
                                        <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{d.name}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{d.price}</span>
                                            <span className="status-pill active" style={{ fontSize: '0.65rem' }}>Visible</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Assignment Modal Sim */}
            {assignModal && (
                <div className="modal-overlay" onClick={() => setAssignModal(null)}>
                    <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Assign Tailor for #{assignModal}</h3>
                            <button className="modal-close" onClick={() => setAssignModal(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>Select a master tailor to handle this custom stitching job.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {TAILORS.map(t => (
                                    <div
                                        key={t.id}
                                        className="selection-card"
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        onClick={() => handleAssign(assignModal, t.id)}
                                    >
                                        <div style={{ textAlign: 'left' }}>
                                            <h4 style={{ margin: 0 }}>{t.name}</h4>
                                            <span style={{ fontSize: '0.75rem', color: '#666' }}>{t.specialty} • {t.load}% Load</span>
                                        </div>
                                        <button className="btn btn-primary btn-sm">Select</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

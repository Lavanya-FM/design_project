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
    { id: 'alt_101', orderId: 'FF-2401', customer: 'Customer A', type: 'Fit Issue', desc: 'Sleeves are 0.5 inch too tight.', status: 'pending', date: ' Feb 08', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
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
                
                // Sanitize incoming admin designs
                const safeDesigns = designsRes.data.map(d => ({
                    ...d,
                    image: (d.image || d.image_url || '').includes('unsplash') ? '/bridal_hero.png' : (d.image || d.image_url || '/classic_embroidery.png')
                }));
                setDesigns(safeDesigns);
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

    // Design Management State
    const [designModal, setDesignModal] = useState(false);
    const [newDesign, setNewDesign] = useState({
        name: '',
        category: 'Bridal',
        price: 4500,
        image_url: '/modern_blouse.png',
        neck: 'Deep U',
        sleeve: 'Short Sleeves',
        back_design: 'Tied Dori',
        fabric: 'Silk',
        color: '#0A192F',
        border: 'Zari Border',
        work_type: 'Plain',
        tassels: 'None'
    });

    const [uploadedImages, setUploadedImages] = useState([
        { preview: '', tag: 'Front View' }
    ]);

    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const newArr = [...uploadedImages];
            newArr[index].preview = reader.result;
            setUploadedImages(newArr);
        };
        reader.readAsDataURL(file);
    };

    const addUploadSlot = () => {
        setUploadedImages([...uploadedImages, { preview: '', tag: 'Sleeve / Side' }]);
    };

    const removeUploadSlot = (index) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    const [aiSurge, setAiSurge] = useState(false);

    const handleAddDesign = async () => {
        if(!newDesign.name) return showToast('Please provide a Design Name', 'error');
        if(!uploadedImages[0]?.preview) return showToast('You must upload at least one Front View image.', 'warning');
        try {
            const mainImg = uploadedImages[0].preview;
            const payload = {
                name: newDesign.name,
                category: newDesign.category,
                price: Number(newDesign.price),
                image: mainImg,
                neck: [newDesign.neck],
                sleeve: [newDesign.sleeve],
                fabric: [newDesign.fabric],
                work_type: newDesign.work_type,
                // Embed the multi-angle image array inside the tags so Customizer can parse it!
                tags: ['new-arrival', newDesign.category.toLowerCase(), newDesign.color, newDesign.border, newDesign.back_design, newDesign.tassels, JSON.stringify(uploadedImages)]
            };
            
            const res = await axios.post(`${CONFIG.API_URL}/designs`, payload);
            if(res.data) {
                setDesigns([{...res.data, image: res.data.image_url || res.data.image || mainImg}, ...designs]);
                showToast('Brand New Design Published to Collections!', 'success');
                setDesignModal(false);
            }
        } catch(err) {
            showToast('Failed to deploy design to production.', 'error');
        }
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
                    <button className={`admin-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>AI Forecaster ✨</button>
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
                                            { id: 'FF-2401', user: 'Customer A.', status: 'Stitching', date: 'Tomorrow' },
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'flex-end' }}>
                            <div>
                                <h3>Master Catalog</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Manage all bespoke garments pushed to your customer gallery.</p>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => setDesignModal(true)}>+ Upload New Design</button>
                        </div>

                        {/* Summary Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                            <div className="dash-card" style={{ padding: '20px' }}>
                                <h4 style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Active Catalog Size</h4>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A192F' }}>{designs.length}</span>
                            </div>
                            <div className="dash-card" style={{ padding: '20px' }}>
                                <h4 style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Trending Category</h4>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C5A059' }}>Bridal Couture</span>
                            </div>
                            <div className="dash-card" style={{ padding: '20px' }}>
                                <h4 style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Avg Base Value</h4>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#27AE60' }}>₹4,250</span>
                            </div>
                        </div>

                        {designs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '4px', border: '2px dashed #e2e8f0' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '16px', opacity: 0.8 }}>👗</div>
                                <h3 style={{ color: '#0A192F', marginBottom: '8px', fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Your Catalog is Empty</h3>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                                    There are currently no bespoke designs published to your customer portal. Upload your first multi-angle design to launch your Atelier.
                                </p>
                                <button className="btn btn-outline" style={{ padding: '12px 24px', borderColor: '#C5A059', color: '#C5A059', fontWeight: 700 }} onClick={() => setDesignModal(true)}>
                                    + Publish First Garment
                                </button>
                            </div>
                        ) : (
                            <div className="op-stats-grid">
                                {designs.slice(0, 12).map(d => (
                                    <div key={d.id} className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                                        <img src={d.image || d.image_url} style={{ width: '100%', height: '140px', objectFit: 'cover' }} alt={d.name} />
                                        <div style={{ padding: '12px' }}>
                                            <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{d.name}</h4>
                                            <p style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '8px' }}>{d.category} • {d.work_type}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{d.price || d.base_price}</span>
                                                <span className="status-pill active" style={{ fontSize: '0.65rem' }}>Live in Store</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="animate-me">
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                            <div className="dash-card">
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0A192F' }}>Atelier Trend Predictor AI</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Machine learning analysis based on last 10,000 customer interactions.</p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ padding: '16px', borderLeft: '4px solid #C5A059', background: '#f8fafc' }}>
                                        <h4 style={{ margin: 0, color: '#C5A059' }}>Upcoming Surge: Velvet Fabric</h4>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#334155' }}>Search volume for "Velvet Blouse" is up 42%. Recommend stocking up on Velvet inventory for Master Ramesh.</p>
                                    </div>
                                    <div style={{ padding: '16px', borderLeft: '4px solid #27AE60', background: '#f8fafc' }}>
                                        <h4 style={{ margin: 0, color: '#27AE60' }}>Optimized: Sweetheart Necklines</h4>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#334155' }}>Currently converting at the highest rate (28%). Consider highlighting these in the main gallery.</p>
                                    </div>
                                    <div style={{ padding: '16px', borderLeft: '4px solid #D02F44', background: '#f8fafc' }}>
                                        <h4 style={{ margin: 0, color: '#D02F44' }}>Warning: Tailor Bottleneck Detected</h4>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#334155' }}>Bridal specialties are nearing 90% capacity. AI suggests shifting non-urgent bridal work to Master Jatin.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="dash-card">
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0A192F' }}>Dynamic Pricing Engine</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Automatically adjust base base customizer prices based on current studio demand.</p>
                                
                                <div style={{ padding: '24px', background: aiSurge ? '#0A192F' : '#f1f5f9', color: aiSurge ? 'white' : '#0A192F', borderRadius: '4px', textAlign: 'center', transition: 'all 0.3s' }}>
                                    <h4 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>{aiSurge ? 'Surge Active (+15%)' : 'Standard Pricing'}</h4>
                                    <p style={{ fontSize: '0.8rem', margin: '0 0 20px 0', opacity: 0.8 }}>Tailor load is at 85%. AI recommends activating surge pricing to manage demand.</p>
                                    <button 
                                        onClick={() => setAiSurge(!aiSurge)}
                                        style={{ background: aiSurge ? '#C5A059' : '#0A192F', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '2px', cursor: 'pointer', fontWeight: 700 }}
                                    >
                                        {aiSurge ? 'DEACTIVATE SURGE' : 'ACTIVATE SURGE PRICING'}
                                    </button>
                                </div>
                            </div>
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

            {/* Upload Design Modal */}
            {designModal && (
                <div className="modal-overlay" onClick={() => setDesignModal(false)}>
                    <div className="modal-card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Upload New Atelier Design</h3>
                            <button className="modal-close" onClick={() => setDesignModal(false)}>×</button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Configure proper property tagging so the new garment appears natively in the customer Collections filters.</p>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>GARMENT NAME</label>
                                <input type="text" className="form-control" placeholder="e.g. Royal Sovereign V-Neck" value={newDesign.name} onChange={e => setNewDesign({...newDesign, name: e.target.value})} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>MASTER CATEGORY</label>
                                    <select className="form-control" value={newDesign.category} onChange={e => setNewDesign({...newDesign, category: e.target.value})}>
                                        <option>Bridal</option>
                                        <option>Reception</option>
                                        <option>Festive</option>
                                        <option>Cocktail</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>BASE PRICE (₹)</label>
                                    <input type="number" className="form-control" value={newDesign.price} onChange={e => setNewDesign({...newDesign, price: e.target.value})} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>NECK STRUCTURE</label>
                                    <select className="form-control" value={newDesign.neck} onChange={e => setNewDesign({...newDesign, neck: e.target.value})}>
                                        <option>Deep U</option><option>Sweetheart</option><option>Boat Neck</option><option>High Neck</option><option>Halter Neck</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>SLEEVE STYLE</label>
                                    <select className="form-control" value={newDesign.sleeve} onChange={e => setNewDesign({...newDesign, sleeve: e.target.value})}>
                                        <option>Sleeveless</option><option>Short Sleeves</option><option>Elbow Length</option><option>Full Sleeves</option><option>Puff Sleeves</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>BACK DESIGN</label>
                                    <select className="form-control" value={newDesign.back_design} onChange={e => setNewDesign({...newDesign, back_design: e.target.value})}>
                                        <option>Tied Dori</option><option>Sheer Net</option><option>Deep U</option><option>Square</option><option>Keyhole</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>FABRIC MATERIAL</label>
                                    <select className="form-control" value={newDesign.fabric} onChange={e => setNewDesign({...newDesign, fabric: e.target.value})}>
                                        <option>Silk</option><option>Velvet</option><option>Brocade</option><option>Net/Lace</option><option>Organza</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>BORDERS & EDGES</label>
                                    <select className="form-control" value={newDesign.border} onChange={e => setNewDesign({...newDesign, border: e.target.value})}>
                                        <option>Plain Border</option><option>Zari Border</option><option>Temple Border</option><option>Cutwork</option><option>Pearl Scallop</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>TASSELS & EXTRAS</label>
                                    <select className="form-control" value={newDesign.tassels} onChange={e => setNewDesign({...newDesign, tassels: e.target.value})}>
                                        <option>None</option><option>Standard Latkans</option><option>Heavy Pearls</option><option>Thread Tassels</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>EMBROIDERY / WORK TYPE</label>
                                    <select className="form-control" value={newDesign.work_type} onChange={e => setNewDesign({...newDesign, work_type: e.target.value})}>
                                        <option>Zari Work</option><option>Aari Embroidery</option><option>Maggam Work</option><option>Mirror Work</option><option>Plain</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>PRIMARY COLOR HEX</label>
                                    <input type="text" className="form-control" placeholder="e.g. #0A192F" value={newDesign.color} onChange={e => setNewDesign({...newDesign, color: e.target.value})} />
                                </div>
                            </div>

                            <div style={{ padding: '16px', border: '1px dashed #C5A059', borderRadius: '4px', background: '#fdfbf7' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C5A059' }}>MULTI-ANGLE IMAGE UPLOADS</label>
                                    <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={addUploadSlot}>+ Add Angle</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {uploadedImages.map((imgObj, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#fff', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
                                            {imgObj.preview ? (
                                                <img src={imgObj.preview} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '2px', border: '1px solid #e2e8f0' }} alt="Preview" />
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', background: '#f1f5f9', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#94a3b8' }}>No Img</div>
                                            )}
                                            
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={e => handleImageUpload(e, index)} 
                                                    style={{ fontSize: '0.75rem' }}
                                                />
                                                <select 
                                                    className="form-control" 
                                                    style={{ padding: '4px', fontSize: '0.75rem', height: 'auto' }}
                                                    value={imgObj.tag}
                                                    onChange={e => {
                                                        const newArr = [...uploadedImages];
                                                        newArr[index].tag = e.target.value;
                                                        setUploadedImages(newArr);
                                                    }}
                                                >
                                                    <option>Front View</option>
                                                    <option>Sleeve / Side</option>
                                                    <option>Back Design</option>
                                                    <option>Close-up Work</option>
                                                </select>
                                            </div>

                                            {index > 0 && (
                                                <button style={{ background: 'none', border: 'none', color: '#D02F44', cursor: 'pointer', fontSize: '1rem' }} onClick={() => removeUploadSlot(index)}>×</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="btn btn-primary btn-block" style={{ marginTop: '10px', padding: '16px', letterSpacing: '1px' }} onClick={handleAddDesign}>
                                PUBLISH MULTI-ANGLE DESIGN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

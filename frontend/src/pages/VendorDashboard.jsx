import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/VendorDashboard.css';

const MOCK_FABRICS = [
    { id: 1, name: 'Royal Raw Silk', type: 'Raw Silk', color: 'Deep Red', stock: 45, unit: 'meters', price: 850, status: 'in-stock', image: 'https://images.unsplash.com/photo-1594938298603-c8148c47e957?w=300' },
    { id: 2, name: 'Ivory Velvet', type: 'Velvet', color: 'Ivory', stock: 22, unit: 'meters', price: 1200, status: 'in-stock', image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=300' },
    { id: 3, name: 'Blush Cotton Silk', type: 'Cotton Silk', color: 'Blush Pink', stock: 60, unit: 'meters', price: 550, status: 'in-stock', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300' },
    { id: 4, name: 'Gold Brocade', type: 'Brocade', color: 'Gold', stock: 8, unit: 'meters', price: 1500, status: 'low-stock', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300' },
    { id: 5, name: 'French Lace Net', type: 'Net/Lace', color: 'White', stock: 0, unit: 'meters', price: 950, status: 'out-of-stock', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300' },
    { id: 6, name: 'Emerald Silk', type: 'Raw Silk', color: 'Emerald Green', stock: 32, unit: 'meters', price: 900, status: 'in-stock', image: 'https://images.unsplash.com/photo-1594938298603-c8148c47e957?w=300' },
];

const MOCK_REQUESTS = [
    { id: 'REQ-001', orderId: 'FF-2401', fabric: 'Royal Raw Silk (Red)', qty: '1.5 meters', tailor: 'Master Ji — Station #4', status: 'pending', urgency: 'high' },
    { id: 'REQ-002', orderId: 'FF-2402', fabric: 'French Lace Net (Ivory)', qty: '2 meters', tailor: 'Master Ji — Station #4', status: 'dispatched', urgency: 'medium' },
    { id: 'REQ-003', orderId: 'FF-2405', fabric: 'Gold Brocade', qty: '1 meter', tailor: 'Seema — Station #2', status: 'pending', urgency: 'low' },
];

const PRICING_SLABS = [
    { range: '1-5 meters', discount: '0%', note: 'Standard retail price' },
    { range: '5-20 meters', discount: '8%', note: 'Small bulk discount' },
    { range: '20-50 meters', discount: '15%', note: 'Wholesale rate' },
    { range: '50+ meters', discount: '22%', note: 'Studio partner rate' },
];

const VendorDashboard = () => {
    const [activeTab, setActiveTab] = useState('catalog');
    const [showAddFabric, setShowAddFabric] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFabrics = MOCK_FABRICS.filter(f => {
        const matchesType = filterType === 'all' || f.type === filterType;
        const matchesSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const fabricTypes = [...new Set(MOCK_FABRICS.map(f => f.type))];

    return (
        <>
            <Navbar />
            <div className="vendor-dashboard">
                {/* Sidebar */}
                <aside className="vendor-sidebar">
                    <div className="sidebar-brand">
                        <span className="brand-icon">🧶</span>
                        <h2>Fabric Vendor</h2>
                        <span className="station-id">Luxe Fabrics Co.</span>
                    </div>

                    <nav className="sidebar-nav">
                        <button className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
                            <span>📦</span> Fabric Catalog
                        </button>
                        <button className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
                            <span>📋</span> Material Requests
                            <span className="nav-badge">{MOCK_REQUESTS.filter(r => r.status === 'pending').length}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>
                            <span>💰</span> Pricing Slabs
                        </button>
                        <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                            <span>📊</span> Analytics
                        </button>
                    </nav>

                    {/* Quick Stats */}
                    <div className="sidebar-stats">
                        <div className="stat-card">
                            <span className="stat-val">{MOCK_FABRICS.length}</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-val" style={{ color: '#E74C3C' }}>{MOCK_FABRICS.filter(f => f.stock <= 10).length}</span>
                            <span className="stat-label">Low Stock</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-val" style={{ color: '#27AE60' }}>₹{Math.round(MOCK_FABRICS.reduce((a, f) => a + f.price * f.stock, 0) / 1000)}K</span>
                            <span className="stat-label">Inventory</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="vendor-main">
                    {activeTab === 'catalog' && (
                        <div className="vendor-content-section">
                            <div className="section-top-bar">
                                <div>
                                    <h1>Fabric Catalog</h1>
                                    <p>{filteredFabrics.length} fabrics in inventory</p>
                                </div>
                                <button className="btn btn-primary" onClick={() => setShowAddFabric(true)}>+ Add Fabric</button>
                            </div>

                            {/* Filters */}
                            <div className="catalog-filters">
                                <div className="search-bar-small">
                                    <span>🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search fabrics..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="type-filters">
                                    <button className={`filter-chip ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All</button>
                                    {fabricTypes.map(t => (
                                        <button key={t} className={`filter-chip ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Add Fabric Modal */}
                            {showAddFabric && (
                                <div className="modal-overlay" onClick={() => setShowAddFabric(false)}>
                                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                                        <div className="modal-header">
                                            <h3>Add New Fabric</h3>
                                            <button className="modal-close" onClick={() => setShowAddFabric(false)}>×</button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="modal-form-grid">
                                                <div className="form-group">
                                                    <label>Fabric Name</label>
                                                    <input type="text" className="form-input" placeholder="e.g. Royal Tussar Silk" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Material Type</label>
                                                    <select className="form-input">
                                                        <option>Raw Silk</option>
                                                        <option>Velvet</option>
                                                        <option>Cotton Silk</option>
                                                        <option>Net/Lace</option>
                                                        <option>Brocade</option>
                                                        <option>Georgette</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Color</label>
                                                    <input type="text" className="form-input" placeholder="e.g. Dusty Rose" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Stock (meters)</label>
                                                    <input type="number" className="form-input" placeholder="50" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Price per Meter (₹)</label>
                                                    <input type="number" className="form-input" placeholder="850" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Image URL</label>
                                                    <input type="text" className="form-input" placeholder="https://..." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-outline" onClick={() => setShowAddFabric(false)}>Cancel</button>
                                            <button className="btn btn-primary" onClick={() => { alert('Fabric added!'); setShowAddFabric(false); }}>Add Fabric</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fabric Grid */}
                            <div className="fabric-catalog-grid">
                                {filteredFabrics.map(fabric => (
                                    <div key={fabric.id} className="fabric-card">
                                        <div className="fabric-img-wrap">
                                            <img src={fabric.image} alt={fabric.name} />
                                            <span className={`stock-badge ${fabric.status}`}>
                                                {fabric.status === 'in-stock' ? '✓ In Stock' : fabric.status === 'low-stock' ? '⚠ Low' : '✕ Out'}
                                            </span>
                                        </div>
                                        <div className="fabric-details">
                                            <h4>{fabric.name}</h4>
                                            <div className="fabric-meta">
                                                <span className="fabric-type">{fabric.type}</span>
                                                <span className="fabric-color">🎨 {fabric.color}</span>
                                            </div>
                                            <div className="fabric-bottom-row">
                                                <div className="fabric-stock">
                                                    <span className="stock-val">{fabric.stock}</span>
                                                    <span className="stock-unit">{fabric.unit}</span>
                                                </div>
                                                <span className="fabric-price">₹{fabric.price}/m</span>
                                            </div>
                                            <div className="fabric-actions">
                                                <button className="btn btn-outline btn-sm">Edit</button>
                                                <button className="btn btn-primary btn-sm">Restock</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="vendor-content-section">
                            <div className="section-top-bar">
                                <div>
                                    <h1>Material Requests</h1>
                                    <p>Pending fabric dispatch requests from tailor stations</p>
                                </div>
                            </div>

                            <div className="requests-table-wrap">
                                <table className="vendor-table">
                                    <thead>
                                        <tr>
                                            <th>Request ID</th>
                                            <th>Order Ref</th>
                                            <th>Fabric Required</th>
                                            <th>Quantity</th>
                                            <th>Destination</th>
                                            <th>Urgency</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_REQUESTS.map(req => (
                                            <tr key={req.id}>
                                                <td><strong>{req.id}</strong></td>
                                                <td>#{req.orderId}</td>
                                                <td>{req.fabric}</td>
                                                <td>{req.qty}</td>
                                                <td>{req.tailor}</td>
                                                <td>
                                                    <span className={`urgency-badge ${req.urgency}`}>
                                                        {req.urgency === 'high' ? '🔴' : req.urgency === 'medium' ? '🟡' : '🟢'} {req.urgency}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${req.status}`}>
                                                        {req.status === 'pending' ? 'Awaiting' : 'Dispatched'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {req.status === 'pending' ? (
                                                        <button className="btn btn-primary btn-sm" onClick={() => alert(`Dispatched ${req.fabric} for ${req.orderId}`)}>
                                                            📦 Dispatch
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: '#27AE60', fontWeight: 600, fontSize: '0.8rem' }}>✓ Sent</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="vendor-content-section">
                            <div className="section-top-bar">
                                <div>
                                    <h1>Pricing Slabs</h1>
                                    <p>Volume-based discounts for studio orders</p>
                                </div>
                            </div>

                            <div className="pricing-grid">
                                {PRICING_SLABS.map((slab, i) => (
                                    <div key={i} className="pricing-slab-card">
                                        <div className="slab-header">
                                            <span className="slab-range">{slab.range}</span>
                                            <span className="slab-discount">{slab.discount} off</span>
                                        </div>
                                        <p className="slab-note">{slab.note}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pricing-note-box">
                                <h4>📋 How Pricing Works</h4>
                                <p>Discounts are automatically applied based on the total fabric quantity in a calendar month. Studio partner rates apply to Fit & Flare's standing orders.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="vendor-content-section">
                            <div className="section-top-bar">
                                <div>
                                    <h1>Vendor Analytics</h1>
                                    <p>Overview of your fabric supply performance</p>
                                </div>
                            </div>

                            <div className="analytics-cards">
                                <div className="analytics-card">
                                    <span className="analytics-icon">📦</span>
                                    <div>
                                        <h2>156</h2>
                                        <p>Total Orders Fulfilled</p>
                                    </div>
                                </div>
                                <div className="analytics-card">
                                    <span className="analytics-icon">💰</span>
                                    <div>
                                        <h2>₹2.4L</h2>
                                        <p>Revenue This Month</p>
                                    </div>
                                </div>
                                <div className="analytics-card">
                                    <span className="analytics-icon">⭐</span>
                                    <div>
                                        <h2>4.8/5</h2>
                                        <p>Quality Rating</p>
                                    </div>
                                </div>
                                <div className="analytics-card">
                                    <span className="analytics-icon">⏱️</span>
                                    <div>
                                        <h2>1.2 Days</h2>
                                        <p>Avg Dispatch Time</p>
                                    </div>
                                </div>
                            </div>

                            <div className="top-fabrics-section">
                                <h3>🔥 Top Selling Fabrics</h3>
                                <div className="top-fabric-list">
                                    {[
                                        { name: 'Royal Raw Silk (Red)', orders: 42, revenue: '₹53,550' },
                                        { name: 'Blush Cotton Silk', orders: 38, revenue: '₹31,350' },
                                        { name: 'Ivory Velvet', orders: 24, revenue: '₹43,200' },
                                        { name: 'Gold Brocade', orders: 18, revenue: '₹40,500' },
                                    ].map((f, i) => (
                                        <div key={i} className="top-fabric-item">
                                            <span className="rank">#{i + 1}</span>
                                            <span className="tf-name">{f.name}</span>
                                            <span className="tf-orders">{f.orders} orders</span>
                                            <span className="tf-revenue">{f.revenue}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default VendorDashboard;

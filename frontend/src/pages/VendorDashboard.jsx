import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CONFIG from '../config';
import '../styles/VendorDashboard.css';

import VendorCatalog from '../features/vendor/VendorCatalog';
import VendorRequests from '../features/vendor/VendorRequests';
import VendorPricing from '../features/vendor/VendorPricing';
import VendorAnalytics from '../features/vendor/VendorAnalytics';
import VendorAddFabricModal from '../features/vendor/VendorAddFabricModal';

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
    
    const [fabrics, setFabrics] = useState([]);
    const [requests, setRequests] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fabRes, reqRes] = await Promise.all([
                    axios.get(`${CONFIG.API_URL}/fabrics`),
                    axios.get(`${CONFIG.API_URL}/fabrics/requests`)
                ]);
                
                setFabrics(fabRes.data || []);
                setRequests(reqRes.data || []);
                
                if (fabRes.data.length === 0) {
                    // Fallback to mock data if API is empty for demo purposes
                    setFabrics([
                        { id: 1, name: 'Royal Raw Silk', type: 'Raw Silk', color: 'Deep Red', stock_quantity: 45, unit: 'meters', price_per_meter: 850, status: 'in-stock', image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c47e957?w=300' },
                        { id: 2, name: 'Ivory Velvet', type: 'Velvet', color: 'Ivory', stock_quantity: 22, unit: 'meters', price_per_meter: 1200, status: 'in-stock', image_url: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=300' },
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch vendor data:", err);
            }
        };
        fetchData();
    }, []);

    const filteredFabrics = fabrics.filter(f => {
        const matchesType = filterType === 'all' || f.type === filterType || f.material_type === filterType;
        const matchesSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const fabricTypes = [...new Set(fabrics.map(f => f.type || f.material_type).filter(Boolean))];

    return (
        <>
            <Navbar />
            <div className="vendor-dashboard">
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
                            <span className="nav-badge">{requests.filter(r => r.status === 'pending').length}</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>
                            <span>💰</span> Pricing Slabs
                        </button>
                        <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                            <span>📊</span> Analytics
                        </button>
                    </nav>

                    <div className="sidebar-stats">
                        <div className="stat-card">
                            <span className="stat-val">{fabrics.length}</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-val" style={{ color: '#E74C3C' }}>{fabrics.filter(f => (f.stock || f.stock_quantity) <= 10).length}</span>
                            <span className="stat-label">Low Stock</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-val" style={{ color: '#27AE60' }}>
                                ₹{Math.round(fabrics.reduce((a, f) => a + (f.price || f.price_per_meter) * (f.stock || f.stock_quantity), 0) / 1000)}K
                            </span>
                            <span className="stat-label">Inventory</span>
                        </div>
                    </div>
                </aside>

                <main className="vendor-main">
                    {activeTab === 'catalog' && (
                        <>
                            <VendorCatalog 
                                fabrics={filteredFabrics} 
                                setShowAddFabric={setShowAddFabric} 
                                filterType={filterType} 
                                setFilterType={setFilterType} 
                                searchQuery={searchQuery} 
                                setSearchQuery={setSearchQuery} 
                                fabricTypes={fabricTypes} 
                            />
                            {showAddFabric && (
                                <VendorAddFabricModal 
                                    setShowAddFabric={setShowAddFabric} 
                                    setFabrics={setFabrics} 
                                />
                            )}
                        </>
                    )}

                    {activeTab === 'requests' && <VendorRequests requests={requests} setRequests={setRequests} />}

                    {activeTab === 'pricing' && <VendorPricing PRICING_SLABS={PRICING_SLABS} />}

                    {activeTab === 'analytics' && <VendorAnalytics />}
                </main>
            </div>
        </>
    );
};

export default VendorDashboard;

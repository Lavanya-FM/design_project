import React from 'react';

const VendorAnalytics = () => {
    return (
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
    );
};

export default VendorAnalytics;

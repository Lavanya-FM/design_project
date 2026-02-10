import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([
        { id: 'ORD-8821', design: 'Royal Zardozi', status: 'In Production', date: 'Oct 12, 2023', price: '₹12,500' },
        { id: 'ORD-7742', design: 'Temple Silk', status: 'Delivered', date: 'Sep 28, 2023', price: '₹9,800' }
    ]);

    return (
        <div className="dashboard-wrapper">
            <Navbar />

            <main className="dashboard-main container">
                <header className="dashboard-header animate-me">
                    <div className="welcome-text">
                        <span>Welcome back,</span>
                        <h1>Priyanka Sharma</h1>
                    </div>
                    <div className="quick-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/collections')}>New Design</button>
                    </div>
                </header>

                {/* Stats / Overview */}
                <section className="stats-section animate-me">
                    <div className="stat-card shadow-lux">
                        <span className="stat-label">Active Orders</span>
                        <span className="stat-value">01</span>
                    </div>
                    <div className="stat-card shadow-lux">
                        <span className="stat-label">Style Points</span>
                        <span className="stat-value">1,250</span>
                    </div>
                    <div className="stat-card shadow-lux">
                        <span className="stat-label">Measurements</span>
                        <span className="stat-value status-v">Verified</span>
                    </div>
                </section>

                <div className="dashboard-grid">
                    {/* Left: Active Orders */}
                    <section className="orders-section animate-me">
                        <div className="section-card glass-panel">
                            <div className="section-header">
                                <h2>Active Orders</h2>
                                <button className="btn-text">View All</button>
                            </div>
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-item" onClick={() => navigate(`/order/${order.id}`)}>
                                        <div className="order-design-icon">🧵</div>
                                        <div className="order-info">
                                            <h4>{order.design}</h4>
                                            <span className="order-id">{order.id} • {order.date}</span>
                                        </div>
                                        <div className="order-meta">
                                            <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                                                {order.status}
                                            </span>
                                            <span className="order-price">{order.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Right: Style Profile */}
                    <aside className="profile-section animate-me">
                        <div className="section-card glass-panel">
                            <div className="section-header">
                                <h2>Your Style Profile</h2>
                            </div>
                            <div className="profile-details">
                                <div className="detail-item">
                                    <label>Favorite Designer</label>
                                    <span>Sabyasachi Heritage</span>
                                </div>
                                <div className="detail-item">
                                    <label>Preferred Fabric</label>
                                    <span>Raw Silk & Velvet</span>
                                </div>
                                <div className="detail-item">
                                    <label>Account Tier</label>
                                    <span className="tier-badge gold">Gold Member</span>
                                </div>
                            </div>
                            <button className="btn btn-outline-primary btn-block" style={{ marginTop: '24px' }}>
                                Edit Measurements
                            </button>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;

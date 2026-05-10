import React from 'react';

const DesignerStats = ({ designCount }) => {
    return (
        <section className="op-stats-grid">
            <div className="op-stat-card primary">
                <h4>Total Designs</h4>
                <div className="op-stat-val">{designCount || 0}</div>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>Active in Gallery</p>
            </div>
            <div className="op-stat-card success">
                <h4>Order Hits</h4>
                <div className="op-stat-val">156</div>
                <p style={{ fontSize: '0.75rem', color: '#27AE60' }}>↑ 4 this week</p>
            </div>
            <div className="op-stat-card">
                <h4>Trending Style</h4>
                <div className="op-stat-val" style={{ fontSize: '1.2rem' }}>Royal Deep U</div>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>Most saved by users</p>
            </div>
        </section>
    );
};

export default DesignerStats;

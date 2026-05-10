import React from 'react';

const DesignerPortfolio = ({ designs, getFullImageUrl, setActiveTab }) => {
    return (
        <div className="animate-me">
            <div className="op-stats-grid">
                {designs.map(design => (
                    <div key={design.id} className="dash-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ position: 'relative' }}>
                            <img src={getFullImageUrl(design.image_url || design.image)} style={{ width: '100%', height: '240px', objectFit: 'cover' }} alt={design.name || design.title} />
                            <span className="status-pill active" style={{ position: 'absolute', top: '10px', right: '10px' }}>Active</span>
                        </div>
                        <div style={{ padding: '16px' }}>
                            <h4 style={{ marginBottom: '8px' }}>{design.name || design.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '12px' }}>{design.category || design.occasion} • {design.work_type}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{design.price}</span>
                                <button className="btn-text btn-sm" style={{ padding: 0 }}>View Stats</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {designs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <p style={{ color: '#999' }}>No designs in your portfolio yet.</p>
                    <button className="btn btn-outline" onClick={() => setActiveTab('upload')}>Upload Your First Design</button>
                </div>
            )}
        </div>
    );
};

export default DesignerPortfolio;

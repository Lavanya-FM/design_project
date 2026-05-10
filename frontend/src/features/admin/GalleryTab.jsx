import React from 'react';

const GalleryTab = ({ designs, setDesignModal }) => {
    return (
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
                                <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{d.name || d.title}</h4>
                                <p style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '8px' }}>{d.category || d.occasion} • {d.work_type}</p>
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
    );
};

export default GalleryTab;

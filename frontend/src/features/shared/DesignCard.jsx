import React from 'react';

const DesignCard = ({ design, navigate, onFullscreen, zoom, pos, handleMouseMove, setZoom }) => {
    if (!design) return null;

    return (
        <div
            className="design-card-premium"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <div className="card-image-container" onClick={() => onFullscreen(design)}>
                <img
                    src={design.image_url || design.image}
                    alt={design.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/classic_embroidery.png'; }}
                />

                {zoom && (
                    <div
                        className="magnifier-loupe"
                        style={{
                            backgroundImage: `url(${design.image_url || design.image})`,
                            backgroundPosition: `${pos.x}% ${pos.y}%`,
                            left: `${pos.x}%`,
                            top: `${pos.y}%`
                        }}
                    />
                )}

                <div className="card-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className="card-actions" style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                        <button className="action-btn wishlist" onClick={() => console.log('Wishlist clicked')}>
                            ♡
                        </button>
                        <button className="action-btn cart" onClick={() => console.log('Cart clicked')}>🛒</button>
                    </div>
                    <button className="btn-customize-cta" onClick={() => navigate('/customizer', { state: { prefill: design } })}>
                        Select & Customize
                    </button>
                    <div className="fullscreen-hint">Click for Fullscreen</div>
                </div>
            </div>
            <div className="card-content">
                <div className="card-meta">
                    <span className="card-cat">{design.category || 'Bridal'}</span>
                    <span className="card-time">🚚 {design.delivery_days || 15} days</span>
                </div>
                <h3 className="card-title" onClick={() => navigate(`/designs/${design.id}`)} style={{ cursor: 'pointer' }}>
                    {design.title || design.name}
                </h3>
                <p className="card-description-mini" style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 10px 0', lineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {design.description || 'Exclusive handcrafted design from our atelier.'}
                </p>
                {design.work_type && (
                    <div className="card-work-badge" style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', color: '#c5a059' }}>
                        ✨ {design.work_type}
                    </div>
                )}
                <div className="card-tags">
                    {design.neck?.[0] && <span className="tag-pill">{design.neck[0]}</span>}
                    {design.sleeve?.[0] && <span className="tag-pill">{design.sleeve[0]}</span>}
                    {design.color?.[0] && <span className="tag-pill">{design.color[0]}</span>}
                </div>
                <div className="card-footer">
                    <div className="card-price">
                        <span className="price-label">Starting at</span>
                        <span className="price-val">₹{design.base_price || design.price || 12000}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignCard;

import React, { useState } from 'react';

const Lightbox = ({ design, allDesigns, onSelect, onClose }) => {
    const similarDesigns = allDesigns
        .filter(d => d.id !== design.id && (d.category === design.category || d.work_type === design.work_type))
        .slice(0, 4);
    const [isFav, setIsFav] = useState(false);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-content animate-pop" onClick={e => e.stopPropagation()}>
                <button className="lightbox-close" onClick={onClose}>×</button>
                <button className={`lightbox-fav ${isFav ? 'active' : ''}`} onClick={() => setIsFav(!isFav)}>♥</button>
                <img src={design.image_url || design.image} alt={design.name} className="lightbox-main-img" onError={(e) => { e.target.src = '/classic_embroidery.png'; }} />

                <div className="lightbox-details">
                    <h3 style={{ marginBottom: '8px' }}>{design.title || design.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'bold' }}>{design.work_type || 'Custom Work'} | {design.fabric || 'Silk'}</p>
                    <p className="lightbox-desc" style={{ marginTop: '15px', color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        {design.description || 'Exclusive handcrafted design from our atelier.'}
                    </p>
                </div>

                {similarDesigns.length > 0 && (
                    <div className="lightbox-recommendations">
                        <h4>You May Also Like</h4>
                        <div className="rec-grid">
                            {similarDesigns.map(s => (
                                <div key={s.id} className="rec-item" onClick={() => onSelect(s)}>
                                    <img src={s.image_url || s.image} alt={s.name} onError={(e) => { e.target.src = '/classic_embroidery.png'; }} />
                                    <span>{s.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lightbox;

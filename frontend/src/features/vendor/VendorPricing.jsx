import React from 'react';

const VendorPricing = ({ PRICING_SLABS }) => {
    return (
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
    );
};

export default VendorPricing;

import React from 'react';

const VendorCatalog = ({ fabrics, setShowAddFabric, filterType, setFilterType, searchQuery, setSearchQuery, fabricTypes }) => {
    return (
        <div className="vendor-content-section">
            <div className="section-top-bar">
                <div>
                    <h1>Fabric Catalog</h1>
                    <p>{fabrics.length} fabrics in inventory</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddFabric(true)}>+ Add Fabric</button>
            </div>

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

            <div className="fabric-catalog-grid">
                {fabrics.map(fabric => (
                    <div key={fabric.id} className="fabric-card">
                        <div className="fabric-img-wrap">
                            <img src={fabric.image || fabric.image_url} alt={fabric.name} />
                            <span className={`stock-badge ${fabric.status || (fabric.stock_quantity > 0 ? 'in-stock' : 'out-of-stock')}`}>
                                {fabric.status === 'in-stock' || fabric.stock_quantity > 10 ? '✓ In Stock' : fabric.stock_quantity > 0 ? '⚠ Low' : '✕ Out'}
                            </span>
                        </div>
                        <div className="fabric-details">
                            <h4>{fabric.name}</h4>
                            <div className="fabric-meta">
                                <span className="fabric-type">{fabric.type || fabric.material_type}</span>
                                <span className="fabric-color">🎨 {fabric.color || 'Mixed'}</span>
                            </div>
                            <div className="fabric-bottom-row">
                                <div className="fabric-stock">
                                    <span className="stock-val">{fabric.stock || fabric.stock_quantity}</span>
                                    <span className="stock-unit">{fabric.unit || 'meters'}</span>
                                </div>
                                <span className="fabric-price">₹{fabric.price || fabric.price_per_meter}/m</span>
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
    );
};

export default VendorCatalog;

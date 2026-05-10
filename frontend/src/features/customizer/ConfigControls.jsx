import React from 'react';

const ConfigControls = ({ 
    prefill, 
    activeTab, 
    setActiveTab, 
    config, 
    updateConfig, 
    totalPrice, 
    navigate,
    OPTIONS,
    COLORS
}) => {
    return (
        <div className="controls-container">
            <div className="controls-card">
                <header className="controls-header">
                    <h1>Bespoke Configuration</h1>
                    <p>Designing: <strong>{prefill.title || prefill.name || 'Custom Atelier Blouse'}</strong></p>
                    {prefill.description && (
                        <p className="design-desc-mini">{prefill.description}</p>
                    )}
                </header>

                <div className="tab-navigation" style={{ flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start' }}>
                    {[...Object.keys(OPTIONS), 'Color Palette'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                            style={{ fontSize: '0.75rem', padding: '8px 16px' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="tab-content" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                    {activeTab === 'Color Palette' ? (
                        <div className="option-group">
                            <label>SELECT PRIMARY COLOR</label>
                            <div className="option-grid">
                                {COLORS.map(c => (
                                    <div
                                        key={c}
                                        className="option-pill"
                                        onClick={() => updateConfig('Color', c)}
                                        style={{ 
                                            background: c, 
                                            width: '50px', 
                                            height: '50px', 
                                            borderRadius: '2px',
                                            border: config['Color'] === c ? '3px solid #C5A059' : '1px solid #e2e8f0',
                                            boxShadow: config['Color'] === c ? '0 4px 10px rgba(197, 160, 89, 0.4)' : 'none',
                                            padding: 0
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="option-group">
                            <label>{activeTab.toUpperCase()}</label>
                            <div className="option-grid">
                                {OPTIONS[activeTab].map(opt => (
                                    <div
                                        key={opt.label}
                                        className={`option-pill ${config[activeTab] === opt.label ? 'selected' : ''}`}
                                        onClick={() => updateConfig(activeTab, opt.label)}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', minWidth: '130px', textAlign: 'center', padding: '16px' }}
                                    >
                                        <span style={{fontWeight: 700}}>{opt.label}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: config[activeTab] === opt.label ? '#ffffff' : '#94a3b8' }}>
                                            {opt.price === 0 ? 'Included' : `+ ₹${opt.price}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <footer className="controls-footer">
                    <div className="price-estimation">
                        <span className="label">Total Contract Price</span>
                        <span className="price">₹{totalPrice}</span>
                    </div>
                    <button className="btn btn-primary btn-block" style={{borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', height: '54px'}} onClick={() => navigate('/measurements', { state: { config, totalPrice, baseDesign: prefill } })}>
                        Confirm Design & Measure
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ConfigControls;

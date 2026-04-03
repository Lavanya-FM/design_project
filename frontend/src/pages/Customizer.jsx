import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { designAPI } from '../services/api';
import CONFIG from '../config';
import '../styles/Customizer.css';

const Customizer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const prefill = location.state?.prefill || {};
    const [compareTarget, setCompareTarget] = useState(null);

    // Extensive Customization Options with Dynamic Pricing!
    const OPTIONS = {
        "Neck Design": [
            { label: 'Deep U', price: 0 },
            { label: 'V Neck', price: 0 },
            { label: 'Sweetheart', price: 200 },
            { label: 'Boat Neck', price: 300 },
            { label: 'High Neck', price: 400 },
            { label: 'Keyhole', price: 250 },
            { label: 'Collar Neck', price: 500 },
            { label: 'Halter Neck', price: 450 },
            { label: 'Square Neck', price: 0 }
        ],
        "Sleeve Style": [
            { label: 'Sleeveless', price: 0 },
            { label: 'Short Sleeves', price: 150 },
            { label: 'Elbow Length', price: 300 },
            { label: '3/4th Sleeves', price: 450 },
            { label: 'Full Sleeves', price: 600 },
            { label: 'Puff Sleeves', price: 400 },
            { label: 'Bell Sleeves', price: 500 },
            { label: 'Ruffle Sleeves', price: 550 }
        ],
        "Back Design": [
            { label: 'Deep U', price: 0 },
            { label: 'Tied Dori', price: 250 },
            { label: 'Sheer Net', price: 600 },
            { label: 'Square', price: 0 },
            { label: 'Keyhole', price: 300 },
            { label: 'Open Back', price: 400 },
            { label: 'Buttoned', price: 350 },
            { label: 'Cross Strings', price: 500 }
        ],
        "Fabric Material": [
            { label: 'Silk', price: 1000 },
            { label: 'Raw Silk', price: 1200 },
            { label: 'Velvet', price: 1800 },
            { label: 'Cotton Silk', price: 600 },
            { label: 'Net/Lace', price: 900 },
            { label: 'Brocade', price: 1400 },
            { label: 'Organza', price: 1500 },
            { label: 'Georgette', price: 800 }
        ],
        "Embroidery & Work": [
            { label: 'Plain', price: 0 },
            { label: 'Thread Work', price: 1200 },
            { label: 'Zari Work', price: 1800 },
            { label: 'Aari Embroidery', price: 2800 },
            { label: 'Mirror Work', price: 2200 },
            { label: 'Stone Work', price: 3500 },
            { label: 'Maggam Work', price: 4000 },
            { label: 'Zardozi Heavy', price: 5000 }
        ],
        "Borders & Edges": [
            { label: 'Plain Border', price: 0 },
            { label: 'Piping', price: 150 },
            { label: 'Zari Border', price: 800 },
            { label: 'Temple Border', price: 1200 },
            { label: 'Lace Border', price: 500 },
            { label: 'Cutwork', price: 1800 },
            { label: 'Pearl Scallop', price: 2000 }
        ],
        "Tassels & Extras": [
            { label: 'None', price: 0 },
            { label: 'Standard Latkans', price: 250 },
            { label: 'Thread Tassels', price: 200 },
            { label: 'Heavy Pearls', price: 700 },
            { label: 'Custom Name Latkans', price: 1200 },
            { label: 'Fabric Flowers', price: 400 }
        ],
        "Padding Setup": [
            { label: 'Non-Padded', price: 0 },
            { label: 'Standard Padded', price: 350 },
            { label: 'Premium Push-up', price: 600 }
        ]
    };

    const COLORS = [
        '#0A192F', '#1e293b', '#C5A059', '#D02F44', '#1B4D3E', 
        '#FFD700', '#f8fafc', '#ffffff', '#000000', '#FFC0CB', 
        '#800080', '#FF8C00', '#98FF98', '#E6E6FA'
    ];

    // Identify standard prefill
    let initialNeck = prefill.neck?.[0] || 'Deep U';
    let initialSleeve = prefill.sleeve?.[0] || 'Short Sleeves';
    let initialFabric = prefill.fabric?.[0] || 'Silk';
    
    // Ensure fallbacks match the dictionary
    if(!OPTIONS["Neck Design"].find(o => o.label === initialNeck)) initialNeck = 'Deep U';
    if(!OPTIONS["Sleeve Style"].find(o => o.label === initialSleeve)) initialSleeve = 'Short Sleeves';
    if(!OPTIONS["Fabric Material"].find(o => o.label === initialFabric)) initialFabric = 'Silk';

    const [activeTab, setActiveTab] = useState('Neck Design');
    const [config, setConfig] = useState({
        "Neck Design": initialNeck,
        "Sleeve Style": initialSleeve,
        "Back Design": 'Tied Dori',
        "Fabric Material": initialFabric,
        "Embroidery & Work": prefill.work_type && OPTIONS["Embroidery & Work"].find(o => o.label === prefill.work_type) ? prefill.work_type : 'Plain',
        "Borders & Edges": 'Plain Border',
        "Tassels & Extras": 'None',
        "Padding Setup": 'Non-Padded',
        "Color": '#0A192F'
    });

    const updateConfig = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

    // Price Calculation
    const basePrice = 2500; // Foundational tailoring cost
    const [totalPrice, setTotalPrice] = useState(basePrice);

    const [wishlistDesigns, setWishlistDesigns] = useState([]);
    const [similarDesigns, setSimilarDesigns] = useState([]);

    useEffect(() => {
        // Price Calculation
        let calculated = basePrice;
        Object.keys(OPTIONS).forEach(category => {
            const selectedLabel = config[category];
            const opt = OPTIONS[category].find(o => o.label === selectedLabel);
            if(opt) calculated += opt.price;
        });
        setTotalPrice(calculated);
    }, [config]);

    useEffect(() => {
        // Fetch Wishlist
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (wishlistIds.length > 0) {
            Promise.all(wishlistIds.map(id => designAPI.getDesignById(id)))
                .then(data => {
                    setWishlistDesigns(data.map(d => ({
                        ...d,
                        images: typeof d.images === 'string' ? JSON.parse(d.images) : d.images
                    })));
                })
                .catch(console.error);
        }

        // Fetch Similar or Trending (Fallback)
        const fetchRecommendations = async () => {
            try {
                let data;
                if (prefill.id) {
                    data = await designAPI.getSimilarDesigns(prefill.id);
                } else {
                    // If customizing from scratch, show trending items as inspiration
                    const trending = await designAPI.getTrendingDesigns();
                    data = trending.designs || trending;
                }
                
                if (data && Array.isArray(data)) {
                    setSimilarDesigns(data.map(d => ({
                        ...d,
                        images: typeof d.images === 'string' ? JSON.parse(d.images) : d.images
                    })));
                }
            } catch (err) {
                console.error("Discovery error:", err);
                setSimilarDesigns([]); // Prevent perpetual loading screen
            }
        };

        fetchRecommendations();
    }, [prefill.id]);

    const getImageUrl = (images) => {
        const url = Array.isArray(images) && images.length > 0 ? images[0] : '/modern_blouse.png';
        if (url.startsWith('http')) return url;
        return `${CONFIG.API_URL.replace('/api', '')}${url}`;
    };


    // Determine safe image to display
    let mainDisplayImage = prefill.image_url || prefill.image || '/classic_embroidery.png';
    if (mainDisplayImage.includes('unsplash') || mainDisplayImage.includes('photo')) {
        mainDisplayImage = '/modern_blouse.png'; // No humans
    }

    // TRUE 360 ROTATION CAROUSEL (Multi-Angle Instead of 2D Flipping)
    const [angleIndex, setAngleIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [lastX, setLastX] = useState(0);

    // Multi-angle references representing Front, Right, Back, Left structural views
    // If we have custom uploaded angles, use them!
    const uploadedAngles = prefill.angles && Array.isArray(prefill.angles) ? prefill.angles : [];
    
    const angles = uploadedAngles.length > 0 
        ? uploadedAngles.map(a => a.path)
        : [
            mainDisplayImage, 
            '/classic_embroidery.png', 
            '/bridal_hero.png', 
            '/modern_blouse.png' 
        ];

    const angleLabels = uploadedAngles.length > 0 
        ? uploadedAngles.map(a => a.tag)
        : ["Front View", "Side View", "Back View", "Detail View"];

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastX(e.clientX);
    };

    const handleMouseMoveDrag = (e) => {
        if (!isDragging) return;
        const delta = e.clientX - lastX;
        
        // When drag threshold is met, spin the angle!
        if (Math.abs(delta) > 40) {
            if (delta > 0) {
                setAngleIndex(prev => (prev + 1) % angles.length);
            } else {
                setAngleIndex(prev => (prev - 1 + angles.length) % angles.length);
            }
            setLastX(e.clientX); // Reset origin
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };


    return (
        <div className="customizer-page">
            <Navbar />
            <div className="customizer-layout">
                {/* 360 Multi-Angle Viewer Area */}
                <div className="preview-container">
                    <div className="preview-card">
                        <div className="preview-label">Live True 360° Studio</div>
                        
                        <div 
                            className="interactive-3d-viewer"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMoveDrag}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            style={{ 
                                cursor: isDragging ? 'grabbing' : 'grab',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <div className="viewer-hint">↔ Drag to Spin 360° | {angleLabels[angleIndex]}</div>
                            
                            <img 
                                key={angleIndex} // Forces re-render fade
                                src={angles[angleIndex]}
                                alt="Blouse Render Angle"
                                className="customizer-target-img fade-in-angle"
                                draggable="false"
                                style={{
                                    transform: `scale(${zoom})`,
                                    transition: 'transform 0.1s ease-out'
                                }}
                            />
                            
                            {/* 360 Spin Indicators */}
                            <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '8px' }}>
                                {angles.map((_, i) => (
                                    <div key={i} style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: i === angleIndex ? '#0A192F' : '#cbd5e1',
                                        border: i === angleIndex ? '2px solid #C5A059' : 'none'
                                    }}/>
                                ))}
                            </div>
                        </div>

                        <div className="zoom-controls">
                            <span className="zoom-label">Zoom Level</span>
                            <input 
                                type="range" 
                                className="zoom-slider"
                                min="1" 
                                max="3" 
                                step="0.1" 
                                value={zoom} 
                                onChange={(e) => setZoom(e.target.value)} 
                            />
                        </div>

                        <div className="preview-meta" style={{marginTop: '15px'}}>
                            <span style={{color: '#C5A059', fontWeight: 800}}>Base Fitting: ₹{basePrice}</span>
                        </div>
                    </div>
                </div>

                {/* Interaction / Controls Area */}
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
                                                    borderRadius: '2px', // Architecture style
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
            </div>

            {/* Wishlist Comparison Section */}
            {wishlistDesigns.length > 0 && (
                <section className="comparison-section">
                    <div className="comparison-header">
                        <h2>Compare with Wishlist</h2>
                        <p>Evaluate your favorites alongside your current configuration</p>
                    </div>
                    <div className="comparison-grid">
                        {wishlistDesigns.map(design => (
                            <div key={design.id} className="comparison-card">
                                <div className="card-image">
                                    <img src={getImageUrl(design.images)} alt={design.title} />
                                    <div className="card-overlay-actions">
                                        <button onClick={() => navigate('/customize', { state: { prefill: design } })}>Start With This</button>
                                        <button onClick={() => setCompareTarget(design)}>Side-by-Side</button>
                                    </div>
                                </div>
                                <div className="card-info">
                                    <h3>{design.title}</h3>
                                    <button className="mini-compare-btn" onClick={() => setCompareTarget(design)}>Compare Stats</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Comparison Modal */}
            {compareTarget && (
                <div className="compare-modal-overlay" onClick={() => setCompareTarget(null)}>
                    <div className="compare-modal-content" onClick={e => e.stopPropagation()}>
                        <header className="compare-modal-header">
                            <h2>Expert Style Comparison</h2>
                            <button className="close-modal" onClick={() => setCompareTarget(null)}>✕</button>
                        </header>
                        <div className="compare-table-container">
                            <table className="compare-table">
                                <thead>
                                    <tr>
                                        <th>Attribute</th>
                                        <th>Current Customization</th>
                                        <th>{compareTarget.title}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Neck Line</td>
                                        <td>{config['Neck Design']}</td>
                                        <td>{compareTarget.neck_type}</td>
                                    </tr>
                                    <tr>
                                        <td>Sleeve Style</td>
                                        <td>{config['Sleeve Style']}</td>
                                        <td>{compareTarget.sleeve_type}</td>
                                    </tr>
                                    <tr>
                                        <td>Fabric</td>
                                        <td>{config['Fabric Material']}</td>
                                        <td>{compareTarget.fabric}</td>
                                    </tr>
                                    <tr>
                                        <td>Estimate</td>
                                        <td>₹{totalPrice}</td>
                                        <td>₹{compareTarget.price}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Similar Designs Section */}
            <section className="similar-designs-bottom">
                <div className="comparison-header">
                    <h2>Inspired by your selection</h2>
                    <p>More artisanal treasures curated for your style</p>
                </div>
                <div className="similar-grid">
                    {similarDesigns.map(design => (
                        <div key={design.id} className="similar-mini-card" onClick={() => navigate('/customize', { state: { prefill: design } })}>
                            <div className="mini-card-image">
                                <img src={getImageUrl(design.images)} alt={design.title} />
                            </div>
                            <div className="mini-card-details">
                                <h4>{design.title}</h4>
                                <span>{design.occasion}</span>
                            </div>
                        </div>
                    ))}
                    {similarDesigns.length === 0 && (
                        <div className="empty-similar">
                            <p>Loading recommendations...</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Customizer;

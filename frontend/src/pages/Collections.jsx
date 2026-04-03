import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CONFIG from '../config';
import '../styles/Collections.css';
import { BLOUSE_DESIGNS } from '../data/designs';

const FILTER_CATEGORIES = {
    Neckline: ['Deep U', 'V Neck', 'Sweetheart', 'Boat Neck', 'Deep Round', 'Pot Neck', 'Keyhole', 'High Neck'],
    Sleeve: ['Sleeveless', 'Short Sleeves', 'Elbow Length', '3/4th Sleeves', 'Full Sleeves', 'Puff Sleeves'],
    Fabric: ['Silk', 'Raw Silk', 'Velvet', 'Cotton Silk', 'Georgette', 'Net/Lace', 'Brocade', 'Tissue Silk'],
    Border: ['Zari Border', 'Temple Border', 'Cutwork', 'Plain Border', 'No Border'],
    Occasion: ['Bridal', 'Reception', 'Festive', 'Cocktail', 'Haldi'],
    Work: ['Maggam Work', 'Zardozi', 'Aari Embroidery', 'Thread Embroidery', 'Stone Work', 'Mirror Work', 'Cutwork'],
    Color: ['Red', 'Deep Red', 'Gold', 'Blue', 'Green', 'Pastel', 'Silver', 'Ivory', 'Pink'],
    Back_Design: ['Tied Dori', 'Sheer Net', 'Deep U', 'Square', 'Keyhole', 'Deep V', 'Closed Back']
};

const SORT_OPTIONS = [
    { label: 'Popular Designs', value: 'popular' },
    { label: 'New Arrivals', value: 'newest' },
    { label: 'Price: Low → High', value: 'price_asc' },
    { label: 'Price: High → Low', value: 'price_desc' },
];

const DesignCard = ({ design, navigate, onFullscreen }) => {
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.pageXOffset) / width) * 100;
        const y = ((e.pageY - top - window.pageYOffset) / height) * 100;
        setPos({ x, y });
    };

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

const Collections = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('search') || '';

    const [allDesigns, setAllDesigns] = useState(BLOUSE_DESIGNS);
    const [filteredDesigns, setFilteredDesigns] = useState(BLOUSE_DESIGNS);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    
    // Check Authentication state
    const userString = localStorage.getItem('user');
    const isAuthenticated = !!userString;

    // E-commerce standard filters state
    const [activeFilters, setActiveFilters] = useState(
        Object.keys(FILTER_CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: [] }), {})
    );
    const [collapsedFilters, setCollapsedFilters] = useState({});

    const [sortBy, setSortBy] = useState('popular');
    const [fullscreenDesign, setFullscreenDesign] = useState(null);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const response = await axios.get(`${CONFIG.API_URL}/designs`);
                if (response.data && response.data.length > 0) {
                    const apiData = response.data.map(d => {
                        // SANITIZE & RESOLVE: Prepend Backend URL for local uploads & prevent human images
                        const backendBase = CONFIG.API_URL.replace('/api', '');
                        let safeImage = d.image_url || d.image;
                        
                        if (safeImage && safeImage.startsWith('/static/uploads/')) {
                            safeImage = `${backendBase}${safeImage}`;
                        } else if (safeImage && (safeImage.includes('unsplash') || safeImage.includes('photo') || safeImage.includes('user'))) {
                            safeImage = '/classic_embroidery.png'; // Enforce safe non-human asset
                        }

                        // Resolve angles if they exist
                        let safeAngles = d.angles || [];
                        if (typeof safeAngles === 'string') {
                            try { safeAngles = JSON.parse(safeAngles); } catch(e) { safeAngles = []; }
                        }
                        safeAngles = safeAngles.map(ang => ({
                            ...ang,
                            path: ang.path.startsWith('/static/uploads/') ? `${backendBase}${ang.path}` : ang.path
                        }));

                        return {
                            ...d,
                            image_url: safeImage,
                            angles: safeAngles,
                            tags: Array.isArray(d.tags) ? d.tags : (d.tags ? JSON.parse(d.tags) : []),
                            neck: Array.isArray(d.neck) ? d.neck : (d.neck ? JSON.parse(d.neck) : []),
                            sleeve: Array.isArray(d.sleeve) ? d.sleeve : (d.sleeve ? JSON.parse(d.sleeve) : []),
                            fabric: Array.isArray(d.fabric) ? d.fabric : (d.fabric ? JSON.parse(d.fabric) : []),
                            color: Array.isArray(d.color) ? d.color : (d.color ? JSON.parse(d.color) : []),
                            back_design: Array.isArray(d.back_design) ? d.back_design : (d.back_design ? JSON.parse(d.back_design) : []),
                        };
                    });
                    const merged = [...BLOUSE_DESIGNS, ...apiData.filter(ad => !BLOUSE_DESIGNS.find(md => md.id === ad.id))];
                    setAllDesigns(merged);
                }
            } catch (err) {
                console.error("API sync failed", err);
            }
        };
        fetchDesigns();
    }, []);

    useEffect(() => {
        let results = [...allDesigns];
        if (searchQuery) {
            const lowQuery = searchQuery.toLowerCase();
            results = results.filter(d =>
                d.name?.toLowerCase().includes(lowQuery) ||
                d.tags?.some(t => t.toLowerCase().includes(lowQuery)) ||
                d.category?.toLowerCase().includes(lowQuery) ||
                d.work_type?.toLowerCase().includes(lowQuery)
            );
        }
        
        Object.keys(activeFilters).forEach(key => {
            const selectedVals = activeFilters[key];
            if (selectedVals.length > 0) {
                if (key === 'Occasion') {
                    results = results.filter(d => selectedVals.includes(d.category));
                } else if (key === 'Work') {
                    results = results.filter(d => selectedVals.includes(d.work_type));
                } else {
                    const mapping = {
                        Neckline: 'neck', Sleeve: 'sleeve', Fabric: 'fabric', Color: 'color', Back_Design: 'back_design'
                    };
                    const propKey = mapping[key] || key.toLowerCase();
                    results = results.filter(d => selectedVals.some(v => (d[propKey] || []).includes(v)));
                }
            }
        });

        if (sortBy === 'price_asc') results.sort((a, b) => (a.base_price || a.price || 0) - (b.base_price || b.price || 0));
        if (sortBy === 'price_desc') results.sort((a, b) => (b.base_price || b.price || 0) - (a.base_price || a.price || 0));
        if (sortBy === 'popular') results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        if (sortBy === 'newest') results.reverse();
        
        setFilteredDesigns(results);
    }, [searchQuery, activeFilters, sortBy, allDesigns]);

    const toggleFilter = (category, value) => {
        setActiveFilters(prev => {
            const current = prev[category] || [];
            const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
            return { ...prev, [category]: next };
        });
    };

    const toggleCollapse = (cat) => {
        setCollapsedFilters(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const clearFilters = () => {
        setActiveFilters(Object.keys(FILTER_CATEGORIES).reduce((acc, cat) => ({ ...acc, [cat]: [] }), {}));
        setSearchQuery('');
        navigate('/collections');
    };

    return (
        <>
            <Navbar />
            {fullscreenDesign && (
                <Lightbox design={fullscreenDesign} allDesigns={allDesigns} onSelect={setFullscreenDesign} onClose={() => setFullscreenDesign(null)} />
            )}
            <div className="page-container collection-page">
                <div className="container collections-layout">
                    
                    {/* E-COMMERCE SIDEBAR */}
                    <aside className="filters-sidebar">
                        <div className="sidebar-header">
                            <h3>Filter By</h3>
                            <button className="btn-text" onClick={clearFilters}>Clear All</button>
                        </div>

                        {Object.entries(FILTER_CATEGORIES).map(([cat, options]) => {
                            const isCollapsed = collapsedFilters[cat];
                            const activeCount = activeFilters[cat]?.length || 0;
                            
                            return (
                                <div key={cat} className="filter-group-ecommerce">
                                    <div className="filter-cat-header" onClick={() => toggleCollapse(cat)}>
                                        <h4>{cat.replace('_', ' ')} {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}</h4>
                                        <span className="collapse-icon">{isCollapsed ? '+' : '-'}</span>
                                    </div>
                                    
                                    {!isCollapsed && (
                                        <div className="filter-checkbox-list">
                                            {options.map(opt => (
                                                <label key={opt} className="filter-checkbox-item">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={activeFilters[cat]?.includes(opt) || false} 
                                                        onChange={() => toggleFilter(cat, opt)} 
                                                    />
                                                    <span className="checkbox-custom"></span>
                                                    <span className="filter-label">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </aside>

                    <main className="results-area">
                        <div className="results-header">
                            <div className="results-info">
                                <h1>Blouse Styles</h1>
                                <p>Discover {filteredDesigns.length} hand-crafted designs.</p>
                            </div>
                            <div className="results-sort">
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Determine Display Designs */}
                        {(() => {
                            const designsToShow = filteredDesigns;
                            
                            return (
                                <>
                                    {designsToShow.length > 0 ? (
                                        <div className="designs-grid">
                                            {designsToShow.map(design => (
                                                <DesignCard key={design.id} design={design} navigate={navigate} onFullscreen={setFullscreenDesign} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <h2>No designs match your precise selection.</h2>
                                            <p style={{color: '#64748b', margin: '10px 0'}}>Try removing some filters to see more results.</p>
                                            <button className="btn-customize-cta" onClick={clearFilters} style={{marginTop: '20px'}}>Clear All Filters</button>
                                        </div>
                                    )}

                                </>
                            );
                        })()}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Collections;

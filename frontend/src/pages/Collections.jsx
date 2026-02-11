import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CONFIG from '../config';
import '../styles/Collections.css';
import { BLOUSE_DESIGNS } from '../data/designs';
import { useSocket } from '../components/SocketContext';

const FILTER_CATEGORIES = {
    neck: [
        { label: 'Deep U', img: 'https://images.unsplash.com/photo-1582533561751-6fb758d4a991?w=100&h=100&fit=crop' },
        { label: 'V Neck', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop' },
        { label: 'Sweetheart', img: 'https://images.unsplash.com/photo-1594144400267-0ef6d628795c?w=100&h=100&fit=crop' },
        { label: 'Boat Neck', img: 'https://images.unsplash.com/photo-1615392601002-3ef72f9a706f?w=100&h=100&fit=crop' },
        { label: 'Deep Round', img: 'https://images.unsplash.com/photo-1610030488171-80ca3602be71?w=100&h=100&fit=crop' },
        { label: 'Pot Neck', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop' },
        { label: 'Keyhole', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100&h=100&fit=crop' },
        { label: 'High Neck', img: 'https://images.unsplash.com/photo-1551048632-24e237311d01?w=100&h=100&fit=crop' }
    ],
    sleeve: [
        { label: 'Sleeveless', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop' },
        { label: 'Short Sleeves', img: 'https://images.unsplash.com/photo-1594144400267-0ef6d628795c?w=100&h=100&fit=crop' },
        { label: 'Elbow Length', img: 'https://images.unsplash.com/photo-1590736704044-672584a39005?w=100&h=100&fit=crop' },
        { label: 'Full Sleeves', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=100&h=100&fit=crop' }
    ],
    fabric: [
        { label: 'Silk', img: 'https://images.unsplash.com/photo-1610030488171-80ca3602be71?w=100&h=100&fit=crop' },
        { label: 'Velvet', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=100&h=100&fit=crop' },
        { label: 'Cotton Silk', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop' },
        { label: 'Net/Lace', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=100&h=100&fit=crop' },
        { label: 'Brocade', img: 'https://images.unsplash.com/photo-1615392601002-3ef72f9a706f?w=100&h=100&fit=crop' }
    ],
    border: [
        { label: 'Zari Border', img: 'https://images.unsplash.com/photo-1551048632-24e237311d01?w=100&h=100&fit=crop' },
        { label: 'Temple Border', img: 'https://images.unsplash.com/photo-1590736704044-672584a39005?w=100&h=100&fit=crop' },
        { label: 'Cutwork', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=100&h=100&fit=crop' },
        { label: 'Plain Border', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop' }
    ],
    occasion: [
        { label: 'Bridal', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop' },
        { label: 'Festive', img: 'https://images.unsplash.com/photo-1615392601002-3ef72f9a706f?w=100&h=100&fit=crop' },
        { label: 'Cocktail', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100&h=100&fit=crop' }
    ],
    work: [
        { label: 'Maggam Work', img: 'https://images.unsplash.com/photo-1590736704044-672584a39005?w=100&h=100&fit=crop' },
        { label: 'Zardozi', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop' },
        { label: 'Aari Work', img: 'https://images.unsplash.com/photo-1594144400267-0ef6d628795c?w=100&h=100&fit=crop' },
        { label: 'Stone Work', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100&h=100&fit=crop' }
    ]
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
            className="design-card-premium hover-scale animate-me"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <div className="card-image-container" onClick={() => onFullscreen(design)}>
                <img
                    src={design.image_url || design.image}
                    alt={design.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'; }}
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

                <div className="card-badge">{design.complexity}</div>
                <div className="card-overlay" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-customize-cta" onClick={() => navigate('/customizer', { state: { prefill: design } })}>
                        Select & Customize
                    </button>
                    <div className="fullscreen-hint">Click for Fullscreen</div>
                </div>
            </div>
            <div className="card-content">
                <div className="card-meta">
                    <span className="card-cat">{design.category}</span>
                    <span className="card-time">🚚 {design.delivery_days} days</span>
                </div>
                <h3 className="card-title">{design.name}</h3>
                {design.work_type && (
                    <div className="card-work-badge" style={{ fontSize: '0.7rem', color: '#D02F44', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>
                        ✨ {design.work_type}
                    </div>
                )}
                <div className="card-tags">
                    <span className="tag-pill">{design.neck?.[0]}</span>
                    <span className="tag-pill">{design.sleeve?.[0]}</span>
                    {design.tags?.slice(0, 1).map(t => <span key={t} className="tag-pill">{t}</span>)}
                </div>
                <div className="card-footer">
                    <div className="card-price">
                        <span className="price-label">Starting at</span>
                        <span className="price-val">₹{design.base_price || design.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Lightbox = ({ design, allDesigns, onSelect, onClose }) => {
    // Find similar designs based on category or work_type
    const similarDesigns = allDesigns
        .filter(d => d.id !== design.id && (d.category === design.category || d.work_type === design.work_type))
        .slice(0, 4);

    const [isFav, setIsFav] = useState(false);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-content animate-pop" onClick={e => e.stopPropagation()}>
                <button className="lightbox-close" onClick={onClose}>×</button>
                <button className={`lightbox-fav ${isFav ? 'active' : ''}`} onClick={() => setIsFav(!isFav)}>
                    ♥
                </button>
                <img src={design.image_url || design.image} alt={design.name} className="lightbox-main-img" />

                <div className="lightbox-details">
                    <h3>{design.name}</h3>
                    <p>{design.work_type} | {design.fabric}</p>
                </div>

                {similarDesigns.length > 0 && (
                    <div className="lightbox-recommendations">
                        <h4>You May Also Like</h4>
                        <div className="rec-grid">
                            {similarDesigns.map(s => (
                                <div key={s.id} className="rec-item" onClick={() => onSelect(s)}>
                                    <img src={s.image_url || s.image} alt={s.name} />
                                    <span>{s.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="lightbox-hint">Inspect every stitch. Close to return.</div>
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
    const [activeFilters, setActiveFilters] = useState({
        neck: [], sleeve: [], fabric: [], border: [], occasion: [], work: []
    });
    const [sortBy, setSortBy] = useState('popular');
    const [fullscreenDesign, setFullscreenDesign] = useState(null);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const response = await axios.get(`${CONFIG.API_URL}/designs`);
                if (response.data && response.data.length > 0) {
                    const apiData = response.data.map(d => ({
                        ...d,
                        tags: Array.isArray(d.tags) ? d.tags : (d.tags ? JSON.parse(d.tags) : []),
                        neck: Array.isArray(d.neck) ? d.neck : (d.neck ? JSON.parse(d.neck) : []),
                        sleeve: Array.isArray(d.sleeve) ? d.sleeve : (d.sleeve ? JSON.parse(d.sleeve) : []),
                        fabric: Array.isArray(d.fabric) ? d.fabric : (d.fabric ? JSON.parse(d.fabric) : []),
                    }));
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
                d.tags?.some(t => t.toLowerCase().includes(lowQuery))
            );
        }
        Object.keys(activeFilters).forEach(key => {
            const selectedVals = activeFilters[key];
            if (selectedVals.length > 0) {
                if (key === 'occasion') {
                    results = results.filter(d => selectedVals.includes(d.category));
                } else {
                    results = results.filter(d =>
                        selectedVals.some(v => (d[key] || []).includes(v))
                    );
                }
            }
        });
        if (sortBy === 'price_asc') results.sort((a, b) => (a.base_price || a.price) - (b.base_price || b.price));
        if (sortBy === 'price_desc') results.sort((a, b) => (b.base_price || b.price) - (a.base_price || a.price));
        if (sortBy === 'popular') results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        setFilteredDesigns(results);
    }, [searchQuery, activeFilters, sortBy, allDesigns]);

    const toggleFilter = (category, value) => {
        setActiveFilters(prev => {
            const current = prev[category];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [category]: next };
        });
    };

    const clearFilters = () => {
        setActiveFilters({ neck: [], sleeve: [], fabric: [], border: [], occasion: [], work: [] });
        setSearchQuery('');
        navigate('/collections');
    };

    return (
        <>
            <Navbar />
            {fullscreenDesign && (
                <Lightbox
                    design={fullscreenDesign}
                    allDesigns={allDesigns}
                    onSelect={setFullscreenDesign}
                    onClose={() => setFullscreenDesign(null)}
                />
            )}
            <div className="page-container collection-page">
                <div className="container collections-layout">
                    <aside className="filters-sidebar">
                        <div className="sidebar-header">
                            <h3>Filter By</h3>
                            <button className="btn-text" onClick={clearFilters}>Clear All</button>
                        </div>
                        {Object.entries(FILTER_CATEGORIES).map(([cat, options]) => (
                            <div key={cat} className="filter-group">
                                <h4 className="filter-cat-title">{cat}</h4>
                                <div className="filter-visual-grid">
                                    {options.map(opt => (
                                        <div key={opt.label} className={`visual-pill ${activeFilters[cat].includes(opt.label) ? 'active' : ''}`} onClick={() => toggleFilter(cat, opt.label)}>
                                            <div className="pill-img-wrap"><img src={opt.img} alt={opt.label} /></div>
                                            <span>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
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

                        <div className="designs-grid">
                            {filteredDesigns.map(design => (
                                <DesignCard
                                    key={design.id}
                                    design={design}
                                    navigate={navigate}
                                    onFullscreen={setFullscreenDesign}
                                />
                            ))}
                        </div>

                        {filteredDesigns.length === 0 && (
                            <div className="empty-state">
                                <h2>No designs match your selection</h2>
                                <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Collections;

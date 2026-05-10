import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CONFIG from '../config';
import DesignCard from '../features/shared/DesignCard';
import Lightbox from '../features/shared/Lightbox';
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
    { label: 'Trending', value: 'trending' },
    { label: 'Popular Designs', value: 'popular' },
    { label: 'New Arrivals', value: 'newest' },
    { label: 'Price: Low → High', value: 'price_asc' },
    { label: 'Price: High → Low', value: 'price_desc' },
];

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
                            neck: Array.isArray(d.neck) ? d.neck : (d.neck ? JSON.parse(d.neck) : []),
                            tags: Array.isArray(d.tags) ? d.tags : (d.tags ? (d.tags.startsWith('[') ? JSON.parse(d.tags) : d.tags.split(',')) : []),
                        };
                    });
                    setAllDesigns(apiData);
                }
            } catch (err) {
                console.error("API sync failed", err);
            }
        };
        fetchDesigns();
    }, [sortBy, searchQuery]);

    useEffect(() => {
        let results = Array.isArray(allDesigns) ? [...allDesigns] : [];
        
        // Safety check to prevent crash if allDesigns is not yet loaded or empty
        if (results.length === 0 && !searchQuery) return;
        Object.keys(activeFilters).forEach(key => {
            const selectedVals = activeFilters[key];
            if (selectedVals.length > 0) {
                const mapping = {
                    Neckline: 'neck_type', Sleeve: 'sleeve_type', Fabric: 'fabric', Color: 'color', Work: 'work_type', Occasion: 'occasion'
                };
                const propKey = mapping[key] || key.toLowerCase();
                results = results.filter(d => selectedVals.some(v => d[propKey] === v));
            }
        });
        
        setFilteredDesigns(results);
    }, [activeFilters, allDesigns]);

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

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { designAPI } from '../services/api';
import CONFIG from '../config';
import '../styles/Customizer.css';

import Viewer360 from '../features/customizer/Viewer360';
import ConfigControls from '../features/customizer/ConfigControls';
import CompareModal from '../features/customizer/CompareModal';

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

    let initialNeck = prefill.neck?.[0] || 'Deep U';
    let initialSleeve = prefill.sleeve?.[0] || 'Short Sleeves';
    let initialFabric = prefill.fabric?.[0] || 'Silk';
    
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

    const basePrice = 2500;
    const [totalPrice, setTotalPrice] = useState(basePrice);

    const [wishlistDesigns, setWishlistDesigns] = useState([]);
    const [similarDesigns, setSimilarDesigns] = useState([]);

    useEffect(() => {
        let calculated = basePrice;
        Object.keys(OPTIONS).forEach(category => {
            const selectedLabel = config[category];
            const opt = OPTIONS[category].find(o => o.label === selectedLabel);
            if(opt) calculated += opt.price;
        });
        setTotalPrice(calculated);
    }, [config]);

    useEffect(() => {
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

        const fetchRecommendations = async () => {
            try {
                let data;
                if (prefill.id) {
                    data = await designAPI.getSimilarDesigns(prefill.id);
                } else {
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
                setSimilarDesigns([]); 
            }
        };

        fetchRecommendations();
    }, [prefill.id]);

    const getImageUrl = (images) => {
        const url = Array.isArray(images) && images.length > 0 ? images[0] : '/modern_blouse.png';
        if (url.startsWith('http')) return url;
        return `${CONFIG.API_URL.replace('/api', '')}${url}`;
    };

    let mainDisplayImage = prefill.image_url || prefill.image || '/classic_embroidery.png';
    if (mainDisplayImage.includes('unsplash') || mainDisplayImage.includes('photo')) {
        mainDisplayImage = '/modern_blouse.png'; 
    }

    const uploadedAngles = prefill.angles && Array.isArray(prefill.angles) ? prefill.angles : [];
    const angleLabels = ["Front View", "Side View", "Back View", "Detail View"];

    return (
        <div className="customizer-page">
            <Navbar />
            <div className="customizer-layout">
                <Viewer360 
                    mainDisplayImage={mainDisplayImage}
                    uploadedAngles={uploadedAngles}
                    angleLabels={angleLabels}
                    basePrice={basePrice}
                />

                <ConfigControls 
                    prefill={prefill}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    config={config}
                    updateConfig={updateConfig}
                    totalPrice={totalPrice}
                    navigate={navigate}
                    OPTIONS={OPTIONS}
                    COLORS={COLORS}
                />
            </div>

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

            <CompareModal 
                compareTarget={compareTarget} 
                setCompareTarget={setCompareTarget} 
                config={config} 
                totalPrice={totalPrice} 
            />

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

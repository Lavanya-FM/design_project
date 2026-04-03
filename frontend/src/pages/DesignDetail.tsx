import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { designAPI, Blouse } from '../services/api';
import CONFIG from '../config';
import Skeleton from '../components/Skeleton';
import '../styles/DesignDetail.css';

const DesignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [design, setDesign] = useState<Blouse | null>(null);
    const [similar, setSimilar] = useState<Blouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadData(id);
        }
        window.scrollTo(0, 0);
    }, [id]);

    const loadData = async (designId: string) => {
        try {
            setLoading(true);
            const [designData, similarData] = await Promise.all([
                designAPI.getDesignById(designId),
                designAPI.getSimilarDesigns(designId)
            ]);
            
            setDesign({
                ...designData,
                images: typeof designData.images === 'string' ? JSON.parse(designData.images) : designData.images
            });
            setSimilar(similarData.map((d: Blouse) => ({
                ...d,
                images: typeof d.images === 'string' ? JSON.parse(d.images) : d.images
            })));
        } catch (err) {
            setError('Failed to load design details');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imgObj: any) => {
        let url = '';
        if (Array.isArray(imgObj)) url = imgObj[0];
        else if (typeof imgObj === 'string') url = imgObj;
        
        if (!url) return 'https://via.placeholder.com/800x1000';
        if (url.startsWith('http')) return url;
        const base = CONFIG.API_URL.replace('/api', '');
        return `${base}${url}`;
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
            <Skeleton className="aspect-[4/5] rounded-lg" />
            <div className="space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-16 w-full rounded-sm" />
            </div>
        </div>
    );

    if (!design) return <div className="text-center py-24 text-gray-500">Design not found</div>;

    const mainImages = Array.isArray(design.images) ? design.images : [design.images];

    return (
        <div className="atelier-detail-container">
            {/* Breadcrumbs */}
            <nav className="breadcrumb-nav">
                COLLECTIONS <span>/</span> TRADITIONAL SILKS <span>/</span> DETAILED DESIGN
            </nav>

            {/* Hero Section */}
            <main className="detail-hero">
                <div className="hero-media">
                    <img src={getImageUrl(mainImages[activeImageIndex])} alt={design.title} className="fade-in" />
                </div>

                <div className="hero-info animate-me">
                    <p className="info-category">Artisan Blouse Gallery</p>
                    <h1 className="info-title">{design.title}</h1>
                    <p className="info-price">Tailoring starting at ${design.price}</p>
                    
                    <p className="info-desc">{design.description}</p>
                    
                    <div className="action-stack flex flex-col gap-3">
                        <button className="btn-primary-filled" onClick={() => navigate(`/customize/${design.id}`)}>
                            Customize & Book Tailoring
                        </button>
                        <button className="py-4 border border-black/10 uppercase tracking-widest font-bold text-[10px] hover:bg-black hover:text-white transition-colors">
                            Inquiry for Bulk Orders
                        </button>
                    </div>

                    <div className="highlight-grid">
                        <div className="highlight-item">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            <span>Custom Fit</span>
                        </div>
                        <div className="highlight-item">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21V3m0 18a9 9 0 000-18m0 0a9 9 0 010 18" /></svg>
                            <span>Pure Silk</span>
                        </div>
                        <div className="highlight-item">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
                            <span>Global Shipping</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Multi-angle Detail Gallery */}
            <section className="detail-gallery">
                {mainImages.map((img, i) => (
                    <div key={i} className="gallery-item hover-scale">
                        <img src={getImageUrl(img)} alt={`Angle ${i+1}`} />
                        <span className="text-[10px] absolute bottom-4 left-4 bg-white/90 px-2 py-1 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {i === 0 ? 'Angle 1' : 'Detail Shot'}
                        </span>
                    </div>
                ))}
            </section>

            {/* Story Section */}
            <section className="story-section">
                <div className="story-content animate-me">
                    <p className="story-label">Heritage & Soul</p>
                    <h2 className="story-title">The Art of the Stitch</h2>
                    <p className="story-text">{design.story_text || `This artisan piece begins its journey at our looms, where pure fabric is fused with intricate detailing. Once the fabric arrives at our atelier, a master artisan spends countless hours hand-applying the embroidery.`}</p>
                </div>
                <div className="story-media fade-in">
                    <img src="/static/images/designs/bridal_aari_back.png" className="story-image" alt="Stitching view" />
                    <div className="artisan-tag">
                        <p>Master Artisan</p>
                        <span>{design.artisan_name || 'Artisan Team'}</span>
                    </div>
                </div>
            </section>

            {/* Material Anatomy */}
            <section className="anatomy-section">
                <h2 className="anatomy-title">Material Anatomy</h2>
                <div className="anatomy-grid">
                    {(() => {
                        const anatomy = typeof design.anatomy_json === 'string' ? JSON.parse(design.anatomy_json || '[]') : (design.anatomy_json || []);
                        const displayAnatomy = anatomy.length > 0 ? anatomy : [
                            { title: 'Base Fabric', desc: 'Pure Kanchipuram Silk sourced from weaving cooperatives.' },
                            { title: 'Lining', desc: 'Cotton Mulmul. Double layered for comfort against the skin.' },
                            { title: 'Embellishment', desc: 'Hand-stitched Zardosi. Real metallic threads.' }
                        ];
                        return displayAnatomy.map((item: any, idx: number) => (
                            <div key={idx} className="anatomy-item">
                                <div className="anatomy-icon">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" strokeWidth={1}/>
                                    </svg>
                                </div>
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        ));
                    })()}
                </div>
            </section>

            {/* Tailored Section */}
            <section className="anatomy-section py-20 border-t border-b border-black/5 bg-white">
                 <div className="max-w-screen-xl mx-auto px-10 text-center">
                    <h2 className="anatomy-title">Tailored to Your Vision</h2>
                    <p className="max-w-2xl mx-auto opacity-70 leading-relaxed text-sm">The {design.title} serves as a canvas. Select from our signature cuts to find your perfect silhouette.</p>
                 </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="testimonial-grid">
                    {(() => {
                        const reviews = typeof design.reviews_json === 'string' ? JSON.parse(design.reviews_json || '[]') : (design.reviews_json || []);
                        const displayReviews = reviews.length > 0 ? reviews : [
                            { author: 'Elena V.', location: 'London', rating: 5, text: "The weight of the silk and the brilliance of the gold zari is unlike anything I've seen in modern retail. Truly an heirloom piece." },
                            { author: 'Khalli d.', location: 'Mumbai', rating: 5, text: "Feeling the virtual tailor was seamless. The blouse fits like a second skin. The craftsmanship is evident in every hidden seam." },
                            { author: 'Margaret K.', location: 'New York', rating: 5, text: "I wore this for my daughter's wedding and received endless compliments." }
                        ];
                        return displayReviews.map((r: any, i: number) => (
                            <div key={i} className="testimonial-card">
                                <div className="stars text-gold">★★★★★</div>
                                <p className="testimonial-quote">"{r.text || r.q}"</p>
                                <p className="testimonial-author">— {r.author || r.a}, {r.location || ''}</p>
                            </div>
                        ));
                    })()}
                </div>
            </section>

            {/* Sticky Bottom Bar */}
            <div className="sticky-action-bar">
                <div className="sticky-brief">
                    <img src={getImageUrl(mainImages[0])} alt="mini brief" />
                    <div>
                        <h5>{design.title}</h5>
                        <p className="sticky-price">Estimated Total: $ {design.price}</p>
                    </div>
                </div>
                <button className="btn-start-cust" onClick={() => navigate(`/customize/${design.id}`)}>
                    Start Customization
                </button>
            </div>
        </div>
    );
};

export default DesignDetail;

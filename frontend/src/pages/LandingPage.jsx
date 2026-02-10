import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);

        // Auto-scroll carousel logic
        const interval = setInterval(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollLeft += 2;
                if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
                    scrollRef.current.scrollLeft = 0;
                }
            }
        }, 30);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    const FEATURED_DESIGNS = [
        { id: 1, name: 'Royal Zardosi', img: 'https://images.unsplash.com/photo-1591137133358-3d7ca930491d?w=400' },
        { id: 2, name: 'Temple Silk', img: 'https://images.unsplash.com/photo-1582533561751-6fb758d4a991?w=400' },
        { id: 3, name: 'Velvet Aari', img: 'https://images.unsplash.com/photo-1533038590840-1cde6e56f40f?w=400' },
        { id: 4, name: 'Brocade Luxe', img: 'https://images.unsplash.com/photo-1615392601002-3ef72f9a706f?w=400' },
        { id: 5, name: 'Modern Maggam', img: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=400' },
        { id: 6, name: 'Pearl Heritage', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400' },
    ];

    return (
        <div className="landing-wrapper">
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content container animate-me">
                    <span className="hero-badge">India's Premier Bridal Studio</span>
                    <h1>Elegance Tailored <br />to <span>Perfection</span></h1>
                    <p>Experience the luxury of hand-crafted bridal blouses, measured at home and designed by experts.</p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/collections')}>Browse Collections</button>
                        <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/customizer')}>Design Your Own</button>
                    </div>
                </div>
                <div className="hero-scroll-indicator">
                    <span>Explore</span>
                    <div className="mouse"></div>
                </div>
            </section>

            {/* Featured Carousel */}
            <section className="featured-carousel-section">
                <div className="container">
                    <h2 className="section-title">Trending Masterpieces</h2>
                    <div className="carousel-container" ref={scrollRef}>
                        {[...FEATURED_DESIGNS, ...FEATURED_DESIGNS].map((design, idx) => (
                            <div key={`${design.id}-${idx}`} className="carousel-item shadow-lux" onClick={() => navigate('/collections')}>
                                <img src={design.img} alt={design.name} />
                                <div className="item-info">
                                    <h4>{design.name}</h4>
                                    <span>Bridal Series</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Stats */}
            <section className="trust-strip">
                <div className="container trust-container">
                    <div className="stat-item">
                        <span className="stat-num">15k+</span>
                        <span className="stat-label">Happy Brides</span>
                    </div>
                    <div className="stat-item divider"></div>
                    <div className="stat-item">
                        <span className="stat-num">200+</span>
                        <span className="stat-label">Master Tailors</span>
                    </div>
                    <div className="stat-item divider"></div>
                    <div className="stat-item">
                        <span className="stat-num">Perfect</span>
                        <span className="stat-label">Fit Guarantee</span>
                    </div>
                </div>
            </section>

            {/* Perfect Fit Guarantee */}
            <section className="guarantee-section container">
                <div className="guarantee-card glass-panel">
                    <div className="guarantee-info">
                        <h2>The Perfect Fit <span>Promise</span></h2>
                        <p>Not 100% happy with the fit? We provide complimentary alterations at your doorstep until it's perfect.</p>
                        <ul className="promise-list">
                            <li>✨ AI-Assisted Measurement Verification</li>
                            <li>🪡 Expert Master Tailor Craftsmanship</li>
                            <li>🔄 No-Questions-Asked Alterations</li>
                        </ul>
                    </div>
                    <div className="guarantee-seal">
                        <div className="seal-inner">
                            <span>100%</span>
                            <small>GUARANTEE</small>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;

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
        { id: 1, name: 'Royal Sun-Temple', img: 'https://images.unsplash.com/photo-1590736704044-672584a39005?w=600&q=80' },
        { id: 2, name: 'Zari Petal Luxe', img: 'https://images.unsplash.com/photo-1582533561751-6fb758d4a991?w=600&q=80' },
        { id: 3, name: 'Velvet Midnight', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80' },
        { id: 4, name: 'Brocade Jasmine', img: 'https://images.unsplash.com/photo-1615392601002-3ef72f9a706f?w=600&q=80' },
        { id: 5, name: 'Gold Petal Aari', img: 'https://images.unsplash.com/photo-1591137133358-3d7ca930491d?w=600&q=80' },
        { id: 6, name: 'Silk Ivory Lotus', img: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&q=80' },
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

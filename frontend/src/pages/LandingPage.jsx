import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Scissors, Ruler, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const FEATURED_DESIGNS = [
        { id: 1, name: 'Royal Sun-Temple', category: 'Bridal Collection', img: 'https://images.unsplash.com/photo-1590736704044-672584a39005?w=800&q=80' },
        { id: 2, name: 'Zari Petal Luxe', category: 'Festive Wear', img: 'https://images.unsplash.com/photo-1582533561751-6fb758d4a991?w=800&q=80' },
        { id: 3, name: 'Silk Ivory Lotus', category: 'Contemporary', img: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800&q=80' },
    ];

    return (
        <div className="landing-layout">
            <Navbar />

            {/* Elegant Hero Section */}
            <section className="hero-modern">
                <div className="hero-modern-container">
                    <motion.div 
                        className="hero-modern-text"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="hero-modern-badge">
                            <span className="badge-dot"></span> Custom Tailoring Reimagined
                        </motion.div>
                        <motion.h1 variants={fadeInUp}>
                            Elegant Blouses, <br />
                            <span className="text-italic-accent">Tailored for You.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp}>
                            Experience the luxury of premium fabrics and master craftsmanship. 
                            Design your perfect fit online, and let our experts handle the rest.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="hero-modern-actions">
                            <button className="btn-modern-primary" onClick={() => navigate('/customizer')}>
                                Start Customizing <ArrowRight size={18} />
                            </button>
                            <button className="btn-modern-secondary" onClick={() => navigate('/collections')}>
                                View Gallery
                            </button>
                        </motion.div>
                        
                        <motion.div variants={fadeInUp} className="hero-modern-stats">
                            <div className="stat-block">
                                <strong>15k+</strong>
                                <span>Happy Clients</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-block">
                                <strong>100%</strong>
                                <span>Perfect Fit Guarantee</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div className="hero-modern-visual">
                        <motion.div 
                            className="visual-main-image"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <img src="https://images.unsplash.com/photo-1615392601002-3ef72f9a706f?w=1000&q=80" alt="Elegant Bridal Blouse" />
                            <div className="visual-float-card glass-effect">
                                <ShieldCheck size={24} className="accent-icon" />
                                <div>
                                    <h4>Premium Quality</h4>
                                    <p>Hand-crafted perfection</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="process-modern">
                <div className="container">
                    <motion.div 
                        className="section-header-modern"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <h2>The Process</h2>
                        <p>Three simple steps to your dream outfit.</p>
                    </motion.div>

                    <div className="process-grid">
                        <motion.div 
                            className="process-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="process-icon-wrapper">
                                <Scissors />
                            </div>
                            <h3>1. Design & Detail</h3>
                            <p>Choose your fabric, neck style, sleeves, and intricate embroidery options from our customizer.</p>
                        </motion.div>
                        <motion.div 
                            className="process-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="process-icon-wrapper">
                                <Ruler />
                            </div>
                            <h3>2. Perfect Measurements</h3>
                            <p>Provide your measurements online or schedule a free at-home consultation with our experts.</p>
                        </motion.div>
                        <motion.div 
                            className="process-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="process-icon-wrapper">
                                <CheckCircle />
                            </div>
                            <h3>3. Master Crafting</h3>
                            <p>Our artisans meticulously handcraft your blouse, delivering it directly to your doorstep.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Collection Highlight */}
            <section className="featured-modern">
                <div className="container">
                    <div className="featured-header">
                        <h2>Curated Masterpieces</h2>
                        <button className="btn-link-action" onClick={() => navigate('/collections')}>
                            Explore All <ArrowRight size={16} />
                        </button>
                    </div>
                    
                    <div className="featured-modern-grid">
                        {FEATURED_DESIGNS.map((design, idx) => (
                            <motion.div 
                                key={design.id} 
                                className="featured-modern-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                onClick={() => navigate('/collections')}
                            >
                                <div className="card-image-wrap">
                                    <img src={design.img} alt={design.name} />
                                    <div className="card-overlay">
                                        <span>View Details</span>
                                    </div>
                                </div>
                                <div className="card-modern-info">
                                    <span className="card-category">{design.category}</span>
                                    <h3>{design.name}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;

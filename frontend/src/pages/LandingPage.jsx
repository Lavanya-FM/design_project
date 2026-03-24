import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Briefcase, Target, ShieldCheck, ChevronRight, Diamond } from 'lucide-react';
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

    return (
        <div className="corporate-landing">
            <Navbar />

            {/* Atelier Hero Section */}
            <section className="corp-hero-section">
                <div className="container-corporate">
                    
                    {/* Left Text Content */}
                    <motion.div 
                        className="corp-hero-text"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="corp-badge">
                            <span className="corp-badge-indicator">✦</span>
                            BRIDAL COUTURE
                        </motion.div>
                        <motion.h1 variants={fadeInUp}>
                            Mastering the Art of <br />
                            <span className="hero-italic-gold">Bridal Blouses.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp}>
                            Elevate your special day with our signature bespoke blouses. We specialize in intricate maggam work, aari embroidery, and elegant silhouettes designed explicitly for the modern bride.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="corp-button-group">
                            <button className="btn-corp-primary" onClick={() => navigate('/customizer')}>
                                Design Your Blouse
                            </button>
                            <button className="btn-corp-secondary" onClick={() => navigate('/collections')}>
                                View Bridal Gallery
                            </button>
                        </motion.div>
                        
                        <motion.div variants={fadeInUp} className="corp-trust-metrics">
                            <div className="metric">
                                <strong>10Y+</strong>
                                <span>Bridal Heritage</span>
                            </div>
                            <div className="metric-divider"></div>
                            <div className="metric">
                                <strong>5k+</strong>
                                <span>Blouses Crafted</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Image Content */}
                    <div className="corp-hero-visual">
                        <motion.div 
                            className="corp-image-container"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <img src="/bridal_hero.png" alt="High-end embroidered bridal blouse flat-lay" loading="lazy" />
                            
                            <motion.div 
                                className="corp-overlay-card"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <span className="corp-overlay-title">Premium Silk & Zardosi</span>
                                <span className="corp-overlay-subtitle">Handcrafted with immaculate, intricate precision.</span>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* Collections Portfolio */}
            <section className="corp-portfolio-section">
                <div className="container-corporate">
                    <div className="corp-section-header">
                        <div className="header-text-group">
                            <span className="corp-subheading">BLOUSE ORIGINALS</span>
                            <h2>Exclusive Bridal Blouses</h2>
                        </div>
                        <button className="btn-corp-link" onClick={() => navigate('/collections')}>
                            Explore All <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="corp-portfolio-grid">
                        <motion.div 
                            className="corp-portfolio-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            onClick={() => navigate('/collections')}
                        >
                            <div className="corp-card-image">
                                <img src="/classic_embroidery.png" alt="Traditional Maggam Work Blouse" loading="lazy" />
                            </div>
                            <div className="corp-card-body">
                                <h3>Traditional Maggam Excellence</h3>
                                <p>Heavy, timeless embroidery engineering a commanding bridal presence and eternal sophistication.</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="corp-portfolio-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            onClick={() => navigate('/collections')}
                        >
                            <div className="corp-card-image">
                                <img src="/modern_blouse.png" alt="Modern Pastel Designer Blouse" loading="lazy" />
                            </div>
                            <div className="corp-card-body">
                                <h3>Modern Pastel Silhouettes</h3>
                                <p>Sleek and romantic aesthetic combining contemporary necklines with delicate pastel tones.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="corp-methodology-section">
                <div className="container-corporate">
                    <motion.div 
                        className="corp-center-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="corp-subheading">ATELIER METHODOLOGY</span>
                        <h2>The Bridal Fitting Process</h2>
                        <div className="diamond-divider">
                            <Diamond size={16} /> <Diamond size={16} /> <Diamond size={16} />
                        </div>
                    </motion.div>

                    <div className="corp-process-grid">
                        <motion.div className="corp-process-step" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <div className="corp-step-icon">
                                <Target size={28} />
                            </div>
                            <h4>1. Strategic Consultation</h4>
                            <p>We analyze your stylistic environment, personal brand, and exact measurements to formulate a sartorial strategy.</p>
                        </motion.div>
                        
                        <motion.div className="corp-process-step" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div className="corp-step-icon">
                                <ShieldCheck size={28} />
                            </div>
                            <h4>2. Precision Design</h4>
                            <p>Selection of luxurious silks, followed by meticulous custom blouse pattern generation and artisan aari hand-embroidery.</p>
                        </motion.div>

                        <motion.div className="corp-process-step" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}>
                            <div className="corp-step-icon">
                                <Briefcase size={28} />
                            </div>
                            <h4>3. White-Glove Delivery</h4>
                            <p>Immaculate hand-finishing and quality assurance. Your bridal blouse is delivered securely before your special day.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Atelier CTA Banner */}
            <section className="corp-cta-section">
                <div className="container-corporate">
                    <motion.div 
                        className="corp-cta-box"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="corp-cta-text">
                            <h2>Define Your Sartorial Legacy.</h2>
                            <p>Join our exclusive tailoring network for priority consultations and private access to exceptional, limited-run fabrics.</p>
                        </div>
                        <div className="corp-cta-action">
                            <div className="corp-input-group">
                                <input type="email" placeholder="Enter preferred email address" />
                                <button className="btn-corp-solid">Apply for Access</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;

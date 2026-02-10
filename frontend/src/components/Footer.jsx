import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            {/* TRUST STRIP - Moved here */}
            <div className="footer-trust-strip">
                <div className="trust-item"><span>🛡️</span> <strong>Secure Payments</strong></div>
                <div className="trust-item"><span>🧵</span> <strong>Master Tailors</strong></div>
                <div className="trust-item"><span>🔄</span> <strong>Free Alterations</strong></div>
                <div className="trust-item"><span>🚚</span> <strong>On-time Delivery</strong></div>
            </div>

            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="f-logo">✨ Fit & Flare Studio</Link>
                    <p>Experience the future of bespoke tailoring. Digitally orchestrated for your perfect fit.</p>
                </div>

                <div className="footer-links">
                    <div className="f-col">
                        <h4>Shop</h4>
                        <Link to="/collections">Collections</Link>
                        <Link to="/customizer">Design Your Own</Link>
                        <Link to="/fabrics">Fabric Library</Link>
                    </div>
                    <div className="f-col">
                        <h4>Company</h4>
                        <Link to="/about">Our Story</Link>
                        <Link to="/tailors">Expert Tailors</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>
                    <div className="f-col">
                        <h4>Support</h4>
                        <Link to="/faq">Track Order</Link>
                        <Link to="/shipping">Shipping Policy</Link>
                        <Link to="/returns">Fit Guarantee</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 Fit & Flare Studio. All Rights Reserved. | <Link to="/privacy">Privacy Policy</Link></p>
            </div>
        </footer>
    );
};

export default Footer;

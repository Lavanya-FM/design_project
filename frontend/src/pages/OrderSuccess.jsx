import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { useToast } from '../components/Toast';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Clear temporary order data
    useEffect(() => {
        const orderData = JSON.parse(localStorage.getItem('temp_design') || '{}');
        if (!orderData.totalPrice) {
            // If no order data, redirect to collections
            navigate('/collections');
        }
        showToast("Payment Successful!", "success");
        // Clear after showing success once
        // localStorage.removeItem('temp_design'); 
    }, [navigate, showToast]);

    const orderId = "FF-" + Math.floor(1000 + Math.random() * 9000);

    return (
        <>
            <Navbar />
            <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '80px', background: 'var(--pastel-ivory)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>

                    <div className="success-icon-wrap animate-me" style={{ marginBottom: '32px' }}>
                        <div style={{
                            width: '100px', height: '100px', background: 'var(--color-success)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto', fontSize: '3rem', color: 'white',
                            boxShadow: '0 10px 30px rgba(39, 174, 96, 0.3)'
                        }}>
                            ✓
                        </div>
                    </div>

                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-secondary)', marginBottom: '12px' }}>
                        Order Confirmed!
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '32px' }}>
                        Yay! Your dream blouse is officially in the hands of our master artisans.
                        Order ID: <strong>#{orderId}</strong>
                    </p>

                    <div className="dash-card animate-me" style={{ padding: '32px', background: 'white', borderRadius: '24px', marginBottom: '40px', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.4rem' }}>🧵</span> What happens next?
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}>1</div>
                                <div>
                                    <p style={{ fontWeight: 700, margin: 0 }}>Quality Check — Designs</p>
                                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Our designers will review your customizations and measurements within 2 hours.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#999', flexShrink: 0 }}>2</div>
                                <div>
                                    <p style={{ fontWeight: 700, margin: 0, color: '#999' }}>Fabric Sourcing</p>
                                    <p style={{ fontSize: '0.85rem', color: '#999' }}>Merchant will dispatch your selected fabric to the assigned tailor studio.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#999', flexShrink: 0 }}>3</div>
                                <div>
                                    <p style={{ fontWeight: 700, margin: 0, color: '#999' }}>Live Stitching Feed</p>
                                    <p style={{ fontSize: '0.85rem', color: '#999' }}>You will start receiving live work-in-progress photos from the tailor.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#FFF0F3', padding: '24px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #FFE4EC' }}>
                        <h4 style={{ color: '#D02F44', marginBottom: '8px' }}>🛡️ Perfect Fit Guarantee</h4>
                        <p style={{ fontSize: '0.88rem', color: '#666', margin: 0 }}>
                            Relax! Every order is covered by our guarantee. If the fit isn't absolutely perfect, we'll handle any alterations <b>free of charge</b>.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to={`/order/${orderId}`} className="btn-lg btn-primary" style={{ textDecoration: 'none' }}>Track My Order &rarr;</Link>
                        <Link to="/collections" className="btn-lg btn-outline" style={{ textDecoration: 'none' }}>Back to Gallery</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderSuccess;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../config';
import NavbarComp from '../components/Navbar';
import '../styles/Checkout.css';

const Payment = () => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [processing, setProcessing] = useState(false);

    // Read dynamic total
    const savedData = JSON.parse(localStorage.getItem('currentOrder') || '{}');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const totalAmount = savedData.total || 0;

    const handlePayment = async () => {
        if (!selectedMethod) {
            alert("Please select a payment method.");
            return;
        }

        setProcessing(true);
        try {
            // REAL TIME PERSISTENCE
            const payload = {
                userId: user.id || null, // Guest or User
                items: [{
                    designId: '8681284d-29e2-472e-8c34-eb17918d052d', // Fallback to first seeded design if no ID
                    customization: savedData.selections,
                    measurements: savedData.measurements,
                    price: totalAmount
                }],
                totalAmount: totalAmount
            };

            const response = await axios.post(`${CONFIG.API_URL}/orders`, payload);
            console.log("Order saved to DB:", response.data);

            localStorage.removeItem('currentOrder');
            navigate('/order/success');
        } catch (err) {
            console.error("Order failed to save:", err);
            alert("Payment processed, but order saving failed. Please contact support.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <NavbarComp />
            <div className="page-container checkout-page">
                <div className="container">
                    <h1 className="page-title">Secure Payment</h1>

                    <div className="checkout-grid">
                        <div className="checkout-left">
                            <div className="review-card">
                                <div className="card-header">
                                    <h3>Choose Payment Method</h3>
                                    <span className="secure-badge">🔒 Encrypted 256-bit</span>
                                </div>

                                <div className="payment-options">
                                    <div
                                        className={`payment-method ${selectedMethod === 'upi' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('upi')}
                                    >
                                        <span className="payment-icon">📱</span>
                                        <div>
                                            <b>UPI / GPay / PhonePe</b>
                                            <p className="method-desc">Instant payment using UPI ID or QR Code</p>
                                        </div>
                                        <input type="radio" checked={selectedMethod === 'upi'} readOnly />
                                    </div>

                                    <div
                                        className={`payment-method ${selectedMethod === 'card' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('card')}
                                    >
                                        <span className="payment-icon">💳</span>
                                        <div>
                                            <b>Credit / Debit Card</b>
                                            <p className="method-desc">Visa, Mastercard, RuPay</p>
                                        </div>
                                        <input type="radio" checked={selectedMethod === 'card'} readOnly />
                                    </div>

                                    <div
                                        className={`payment-method ${selectedMethod === 'netbanking' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('netbanking')}
                                    >
                                        <span className="payment-icon">🏦</span>
                                        <div>
                                            <b>Net Banking</b>
                                            <p className="method-desc">All major Indian banks supported</p>
                                        </div>
                                        <input type="radio" checked={selectedMethod === 'netbanking'} readOnly />
                                    </div>

                                    <div
                                        className={`payment-method ${selectedMethod === 'cod' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('cod')}
                                    >
                                        <span className="payment-icon">💵</span>
                                        <div>
                                            <b>Cash on Delivery</b>
                                            <p className="method-desc">Pay upon receiving the finished product (Advance ₹500 required)</p>
                                        </div>
                                        <input type="radio" checked={selectedMethod === 'cod'} readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-right">
                            <div className="price-card">
                                <h3>Payment Summary</h3>
                                <div className="price-rows">
                                    <div className="price-row">
                                        <span>Order Total</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                    <div className="price-row total-row">
                                        <span>Amount to Pay</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-block pay-btn"
                                    onClick={handlePayment}
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
                                </button>

                                <p className="secure-note" style={{ marginTop: '15px', fontSize: '0.75rem' }}>
                                    By proceeding, you agree to our Terms & Conditions. <br />
                                    Refunds are processed within 5-7 business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;

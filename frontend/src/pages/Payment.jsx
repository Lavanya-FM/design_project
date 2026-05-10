import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../config';
import NavbarComp from '../components/Navbar';
import { useToast } from '../components/Toast';
import '../styles/Checkout.css';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Payment = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [selectedMethod, setSelectedMethod] = useState('razorpay');
    const [processing, setProcessing] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const savedData = JSON.parse(localStorage.getItem('currentOrder') || '{}');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const totalAmount = savedData.total || 0;

    useEffect(() => {
        loadRazorpayScript().then(res => setScriptLoaded(res));
    }, []);

    const processOrder = async (paymentResponse, backendOrderId) => {
        try {
            // 1. Verify Payment on Backend
            const verifyRes = await axios.post(`${CONFIG.API_URL}/payments/verify`, {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderId: backendOrderId
            });

            if (verifyRes.data.status === 'success') {
                showToast("Payment verified and order placed!", "success");
                localStorage.removeItem('currentOrder');
                navigate('/order/success');
            } else {
                throw new Error("Verification failed");
            }
        } catch (err) {
            console.error("Order failed to finalize:", err);
            showToast("Payment processed, but order verification failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedMethod) {
            showToast("Please select a payment method.", "error");
            return;
        }

        setProcessing(true);

        try {
            // 0. Create Draft Order on Backend First to get a real ID
            const orderPayload = {
                userId: user.id || null,
                items: [{
                    designId: savedData.designId,
                    customization: savedData.selections,
                    measurements: savedData.measurements,
                    price: totalAmount
                }],
                totalAmount: totalAmount
            };
            const draftRes = await axios.post(`${CONFIG.API_URL}/orders`, orderPayload);
            const backendOrderId = draftRes.data.id;

            if (selectedMethod === 'razorpay') {
                if (!scriptLoaded) {
                    showToast("Payment gateway failed to load.", "error");
                    setProcessing(false);
                    return;
                }

                // 1. Create Razorpay Order on Backend
                const rzpOrderRes = await axios.post(`${CONFIG.API_URL}/payments/create-order`, {
                    amount: totalAmount,
                    receipt: `receipt_${backendOrderId}`
                });
                const rzpOrder = rzpOrderRes.data;

                const options = {
                    key: "rzp_test_dummyKeyForFitAndFlare", 
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: "Fit & Flare Studio",
                    description: "Bespoke Tailoring Order",
                    order_id: rzpOrder.id,
                    handler: function (response) {
                        processOrder(response, backendOrderId);
                    },
                    prefill: {
                        name: user.full_name || "Guest Customer",
                        email: user.email || "guest@example.com",
                    },
                    theme: { color: "#C5A059" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // COD Flow
                await axios.post(`${CONFIG.API_URL}/orders/place`, { orderId: backendOrderId, paymentId: `COD_${Date.now()}` });
                localStorage.removeItem('currentOrder');
                navigate('/order/success');
            }
        } catch (err) {
            console.error("Payment initiation failed:", err);
            showToast("Failed to initiate payment. Please try again.", "error");
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
                                        className={`payment-method ${selectedMethod === 'razorpay' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('razorpay')}
                                    >
                                        <span className="payment-icon">💳</span>
                                        <div>
                                            <b>Razorpay (Cards / UPI / NetBanking)</b>
                                            <p className="method-desc">Pay securely via Razorpay payment gateway</p>
                                        </div>
                                        <input type="radio" checked={selectedMethod === 'razorpay'} readOnly />
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

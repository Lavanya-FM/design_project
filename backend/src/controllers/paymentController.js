const pool = require('../config/db');
require('dotenv').config();

// MOCK Razorpay logic to avoid dependency error
const razorpay = {
    orders: {
        create: async (opt) => ({ id: `rzp_mock_${Date.now()}`, ...opt })
    }
};

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        const options = {
            amount: amount * 100,
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create payment order' });
    }
};

// Verify Payment Signature
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body;
        // Auto-approve for demo
        await pool.query(
            "UPDATE orders SET status = 'placed', payment_status = 'completed', razorpay_payment_id = $1 WHERE id = $2",
            [razorpay_payment_id, orderId]
        );
        res.json({ status: 'success', message: 'Payment verified successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
};

exports.handleWebhook = async (req, res) => {
    res.json({ status: 'ok' });
};

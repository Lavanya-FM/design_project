const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');

// This logic would be integrated into the server.js notification system
const triggerNotifications = (orderId, customerName, details) => {
    // These calls reach out back to the server's notification orchestrator
    // In a microservices setup this would be an Event Bus
};

// 🛒 PLACE ORDER (With Guest-to-Customer Conversion)
router.post('/', (req, res) => {
    const {
        userId,
        guestSessionId,
        items,
        totalAmount,
        shippingAddress
    } = req.body;

    const orderId = uuidv4();
    const status = 'CONFIRMED';

    // 1. Save Base Order
    db.run(`INSERT INTO orders (id, customer_id, guest_session_id, status, total_amount) 
            VALUES (?, ?, ?, ?, ?)`,
        [orderId, userId, guestSessionId, status, totalAmount], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // 2. Save Customizations for each item
            items.forEach(item => {
                const customId = uuidv4();
                db.run(`INSERT INTO customizations (id, order_id, config_json, preview_image_url) 
                VALUES (?, ?, ?, ?)`,
                    [customId, orderId, JSON.stringify(item.customization), item.preview_url]);
            });

            // 3. Trigger Global Alerts
            // We return the orderId so the frontend can trigger the notifications 
            // via the /api/actions/submit-order endpoint we built in server.js
            res.json({ success: true, orderId, message: "Order processed and notifications queued." });
        });
});

module.exports = router;

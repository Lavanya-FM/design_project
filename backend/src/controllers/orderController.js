const pool = require('../config/db');

exports.getAllOrders = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, u.full_name as customer_name, t.full_name as tailor_name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            LEFT JOIN users t ON o.tailor_id = t.id
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- CUSTOMER FLOW ---

// Create initial draft or update existing draft
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;

        // 1. Create Order Record (Draft)
        const newOrder = await pool.query(
            "INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, 'draft') RETURNING *",
            [userId, totalAmount]
        );

        // 2. Insert Items (Simplified loop)
        // In production, use a transaction for consistency
        for (const item of items) {
            await pool.query(
                `INSERT INTO order_items (order_id, base_design_id, customization_details, measurement_snapshot, unit_price, subtotal) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [newOrder.rows[0].id, item.designId, item.customization, item.measurements, item.price, item.price]
            );
        }

        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Step 5: Lock Design & Measurements
exports.lockOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        // Validate design constraints here if needed
        const order = await pool.query(
            "UPDATE orders SET status = 'locked' WHERE id = $1 RETURNING *",
            [orderId]
        );
        res.json(order.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Step 6: Payment Success -> Place Order
exports.placeOrder = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;
        // Verify payment...
        const order = await pool.query(
            "UPDATE orders SET status = 'placed', payment_status = 'completed' WHERE id = $1 RETURNING *",
            [orderId]
        );
        // Trigger generic "New Order" notification to Admin/Merchants
        res.json(order.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// --- ADMIN / OPERATIONS FLOW ---

// Assign Tailor to Order
exports.assignTailor = async (req, res) => {
    try {
        const { orderId, tailorId } = req.body;
        const order = await pool.query(
            "UPDATE orders SET tailor_id = $1, status = 'accepted' WHERE id = $2 RETURNING *",
            [tailorId, orderId]
        );
        res.json(order.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update Status (Tailor updates progress)
exports.updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        // Validate transitions (e.g. In Production -> QC)
        const order = await pool.query(
            "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
            [status, orderId]
        );
        res.json(order.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Submit Quality Check (Tailor -> Admin)
exports.submitQC = async (req, res) => {
    try {
        const { orderId, passedChecks, comments } = req.body;
        const qc = await pool.query(
            `INSERT INTO quality_checks (order_id, measurements_verified, finishing_verified, addons_verified, comments, status)
             VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
            [orderId, passedChecks.measurements, passedChecks.finishing, passedChecks.addons, comments]
        );

        await pool.query("UPDATE orders SET status = 'quality_check' WHERE id = $1", [orderId]);

        res.json(qc.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

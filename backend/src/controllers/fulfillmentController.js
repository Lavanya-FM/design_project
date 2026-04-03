const pool = require('../config/db');

/**
 * GET /designer/orders
 * List orders assigned or available for designers/tailors
 */
exports.getDesignerOrders = async (req, res) => {
    const designer_id = req.user.id; // From auth middleware
    try {
        const query = `
            SELECT o.*, u.full_name as customer_name, u.email as customer_email,
            (SELECT json_agg(oi.*) FROM order_items oi WHERE oi.order_id = o.id) as items
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.designer_id = $1 OR (o.designer_id IS NULL AND o.status = 'placed')
            ORDER BY o.created_at DESC
        `;
        const result = await pool.query(query, [designer_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch Designer orders' });
    }
};

/**
 * POST /orders/:id/accept
 */
exports.acceptOrder = async (req, res) => {
    const { id } = req.params;
    const designer_id = req.user.id;
    try {
        const update = `
            UPDATE orders 
            SET status = 'accepted', designer_id = $1, updated_at = NOW() 
            WHERE id = $2 AND (status = 'placed')
            RETURNING *
        `;
        const result = await pool.query(update, [designer_id, id]);
        
        if (result.rows.length === 0) return res.status(400).json({ error: 'Order not available' });

        // Log history
        await pool.query(
            'INSERT INTO order_status_history (order_id, old_status, new_status, changed_by) VALUES ($1, $2, $3, $4)',
            [id, 'placed', 'accepted', designer_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Accept failed' });
    }
};

/**
 * PATCH /orders/:id/status
 * Workflow Engine: update status with rules
 */
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status, comments, tracking_id } = req.body;
    const user_id = req.user.id;

    const VALID_FLOW = {
        'accepted': ['stitching', 'in_production'],
        'stitching': ['ready', 'quality_check'],
        'in_production': ['quality_check'],
        'quality_check': ['shipped', 'ready'],
        'ready': ['shipped', 'dispatched'],
        'shipped': ['delivered'],
        'dispatched': ['delivered']
    };

    try {
        const current = await pool.query('SELECT status FROM orders WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

        const oldStatus = current.rows[0].status;
        
        // Simple validation or just update
        const query = `
            UPDATE orders 
            SET status = $1, tracking_id = COALESCE($2, tracking_id), updated_at = NOW() 
            WHERE id = $3 
            RETURNING *
        `;
        const result = await pool.query(query, [status, tracking_id, id]);

        // Log history
        await pool.query(
            'INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, comments) VALUES ($1, $2, $3, $4, $5)',
            [id, oldStatus, status, user_id, comments]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

/**
 * POST /orders/:id/messages
 */
exports.sendMessage = async (req, res) => {
    const { id } = req.params;
    const { text, attachment } = req.body;
    const sender_id = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO order_messages (order_id, sender_id, message_text, attachment_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, sender_id, text, attachment]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Message failed' });
    }
};

/**
 * GET /orders/:id/messages
 */
exports.getMessages = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT m.*, u.full_name as sender_name FROM order_messages m JOIN users u ON m.sender_id = u.id WHERE m.order_id = $1 ORDER BY m.created_at ASC', [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
};

/**
 * POST /orders/:id/rate
 */
exports.rateOrder = async (req, res) => {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    const user_id = req.user.id;

    try {
        // Find designer/tailor
        const orderRes = await pool.query('SELECT designer_id, tailor_id FROM orders WHERE id = $1', [id]);
        const target_id = orderRes.rows[0].designer_id || orderRes.rows[0].tailor_id;

        const result = await pool.query(
            'INSERT INTO order_ratings (order_id, user_id, designer_id, rating, feedback) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, user_id, target_id, rating, feedback]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Rating failed' });
    }
};

/**
 * GET /admin/stats
 * Monitor distribution of artisan projects
 */
exports.getAdminStats = async (req, res) => {
    try {
        const stats = await pool.query('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
        res.json(stats.rows);
    } catch (err) {
        res.status(500).json({ error: 'Stats failed' });
    }
};

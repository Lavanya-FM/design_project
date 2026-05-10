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
        'placed': ['accepted'],
        'accepted': ['stitching', 'in_production'],
        'stitching': ['ready', 'quality_check'],
        'in_production': ['quality_check'],
        'quality_check': ['shipped', 'ready'],
        'ready': ['shipped', 'dispatched'],
        'shipped': ['delivered'],
        'dispatched': ['delivered']
    };

    const STITCHING_STAGES = ['Cutting', 'Stitching', 'Embroidery', 'Finishing', 'Ready'];

    try {
        const current = await pool.query('SELECT status, stitching_stage FROM orders WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

        const oldStatus = current.rows[0].status;
        const { status: newStatus, stitching_stage: newStage, comments, tracking_id } = req.body;
        
        // Simple update logic
        const query = `
            UPDATE orders 
            SET status = COALESCE($1, status), 
                stitching_stage = COALESCE($2, stitching_stage),
                tracking_id = COALESCE($3, tracking_id), 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 
            RETURNING *
        `;
        const result = await pool.query(query, [newStatus, newStage, tracking_id, id]);

        // Log history
        await pool.query(
            'INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, comments) VALUES ($1, $2, $3, $4, $5)',
            [id, oldStatus, newStatus || oldStatus, user_id, comments || (newStage ? `Stage: ${newStage}` : '')]
        );

        // --- SOCKET EMIT ---
        const io = req.app.get('io');
        if (io) {
            io.to(`order_${id}`).emit('status_update', {
                orderId: id,
                status: newStatus || oldStatus,
                stitching_stage: newStage || current.rows[0].stitching_stage
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

exports.toggleAvailability = async (req, res) => {
    const userId = req.user.id;
    const { isAvailable } = req.body;
    try {
        await pool.query("UPDATE users SET is_available = $1 WHERE id = $2", [isAvailable, userId]);
        res.json({ success: true, is_available: isAvailable });
    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle availability' });
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

        // --- SOCKET EMIT ---
        const io = req.app.get('io');
        if (io) {
            io.to(`order_${id}`).emit('new_message', result.rows[0]);
        }

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

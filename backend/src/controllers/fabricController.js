const pool = require('../config/db');

exports.getAllFabrics = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM fabrics WHERE is_active = true');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createFabric = async (req, res) => {
    try {
        const { merchantId, name, description, materialType, imageUrl, pricePerMeter, stockQuantity } = req.body;
        const result = await pool.query(
            `INSERT INTO fabrics (merchant_id, name, description, material_type, image_url, price_per_meter, stock_quantity)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [merchantId, name, description, materialType, imageUrl, pricePerMeter, stockQuantity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMaterialRequests = async (req, res) => {
    try {
        // Query orders that need fabric (e.g. status = 'placed')
        // In a real system, you'd have a specific table or status
        const result = await pool.query(`
            SELECT o.id as order_id, oi.id as item_id, d.fabric as fabric_needed, 
                   u.full_name as customer_name, t.full_name as tailor_name,
                   o.status, o.created_at
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN designs d ON oi.base_design_id = d.id
            JOIN users u ON o.user_id = u.id
            LEFT JOIN users t ON o.tailor_id = t.id
            WHERE o.status = 'placed'
            ORDER BY o.created_at DESC
        `);
        
        const requests = result.rows.map(r => ({
            id: `REQ-${r.item_id.toString().slice(0, 4)}`,
            orderId: r.order_id,
            fabric: r.fabric_needed,
            qty: '1.5 meters', 
            customer: r.customer_name,
            tailor: r.tailor_name || 'Production Unit',
            status: r.status === 'placed' ? 'pending' : 'dispatched',
            urgency: 'high',
            date: r.created_at
        }));
        
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.dispatchMaterial = async (req, res) => {
    try {
        const { orderId } = req.params;
        // Update order status to indicate fabric is moving
        await pool.query("UPDATE orders SET status = 'accepted' WHERE id = $1", [orderId]);
        
        // Log history
        await pool.query(
            'INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, comments) VALUES ($1, $2, $3, $4, $5)',
            [orderId, 'placed', 'accepted', 'VENDOR_SYSTEM', 'Fabric dispatched by vendor.']
        );
        
        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

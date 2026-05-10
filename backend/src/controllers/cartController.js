const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// --- CART ---
exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(`
            SELECT c.*, d.title, d.price, d.images 
            FROM cart_items c 
            JOIN designs d ON c.design_id = d.id 
            WHERE c.user_id = $1
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { designId, customization, measurements } = req.body;
    try {
        const id = uuidv4();
        await pool.query(
            "INSERT INTO cart_items (id, user_id, design_id, customization_json, measurements_json) VALUES ($1, $2, $3, $4, $5)",
            [id, userId, designId, JSON.stringify(customization), JSON.stringify(measurements)]
        );
        res.json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM cart_items WHERE id = $1", [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
};

// --- WISHLIST ---
exports.getWishlist = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(`
            SELECT w.*, d.title, d.price, d.images 
            FROM wishlist_items w 
            JOIN designs d ON w.design_id = d.id 
            WHERE w.user_id = $1
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

exports.toggleWishlist = async (req, res) => {
    const userId = req.user.id;
    const { designId } = req.body;
    try {
        const existing = await pool.query("SELECT * FROM wishlist_items WHERE user_id = $1 AND design_id = $2", [userId, designId]);
        if (existing.rows.length > 0) {
            await pool.query("DELETE FROM wishlist_items WHERE user_id = $1 AND design_id = $2", [userId, designId]);
            res.json({ status: 'removed' });
        } else {
            await pool.query("INSERT INTO wishlist_items (id, user_id, design_id) VALUES ($1, $2, $3)", [uuidv4(), userId, designId]);
            res.json({ status: 'added' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle wishlist' });
    }
};

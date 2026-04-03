const pool = require('../config/db');

/**
 * POST /customize
 * Save a custom design request
 */
exports.saveCustomization = async (req, res) => {
    const { design_id, config, measurements, notes, price_estimated } = req.body;
    const user_id = req.user ? req.user.id : null;

    try {
        const result = await pool.query(
            `INSERT INTO customizations (design_id, user_id, config, measurements, notes, price_estimated) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [design_id, user_id, JSON.stringify(config), JSON.stringify(measurements), notes, price_estimated]
        );

        // Optional: Track this as a 'click' or 'start_order' in activity
        await pool.query(
            'INSERT INTO user_activity (user_id, design_id, activity_type) VALUES ($1, $2, $3)',
            [user_id, design_id, 'click']
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error saving customization:", err);
        res.status(500).json({ error: 'Failed to save customization' });
    }
};

/**
 * GET /customize/:id
 */
exports.getCustomizationById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM customizations WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

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

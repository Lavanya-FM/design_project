const pool = require('../config/db');

// Mock data in case DB fails
const MOCK_DESIGNS = [
    {
        id: 1,
        name: "Royal Silk Deep U",
        category: "Bridal",
        price: 2500,
        neck: ["Deep U"],
        sleeve: ["Short Sleeves"],
        fabric: ["Raw Silk"],
        tags: ["bridal", "wedding", "designer"],
        image_url: "/images/blouses/deep-u-silk.jpg",
        description: "Timeless & Elegant Bridal Choice",
        popularity: 10
    },
    {
        id: 2,
        name: "Modern High Neck",
        category: "Workwear",
        price: 1800,
        neck: ["High Neck"],
        sleeve: ["Full Sleeves"],
        fabric: ["Cotton Silk"],
        tags: ["office", "modern"],
        image_url: "/images/blouses/high-neck-modern.jpg",
        description: "Sophisticated Cover for professional settings",
        popularity: 8
    },
    {
        id: 3,
        name: "Party Keyhole",
        category: "Party",
        price: 2200,
        neck: ["Keyhole"],
        sleeve: ["Sleeveless"],
        fabric: ["Net/Lace"],
        tags: ["party", "glam"],
        image_url: "/images/blouses/keyhole-party.jpg",
        description: "Dainty Detail for your special evening",
        popularity: 9
    }
];

exports.getAllDesigns = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM base_designs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Database Error (Using Mock Data):", err.message);
        res.json(MOCK_DESIGNS);
    }
};

exports.createDesign = async (req, res) => {
    const { name, category, price, image, description, neck, sleeve, fabric, tags, work_type, props } = req.body;
    try {
        // In a real DB, we'd need to update the schema to support these new columns or store them as JSON
        const result = await pool.query(
            'INSERT INTO base_designs (name, category, price, image_url, description, neck, sleeve, fabric, tags, work_type, props, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING *',
            [name, category, price, image, description || 'New Design', JSON.stringify(neck), JSON.stringify(sleeve), JSON.stringify(fabric), JSON.stringify(tags), work_type, JSON.stringify(props)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating design:", err);
        // Mock success for UI demo if DB fails (following user principle)
        res.status(201).json({
            id: Date.now(),
            name,
            category,
            price,
            image_url: image,
            neck: Array.isArray(neck) ? neck : [neck],
            sleeve: Array.isArray(sleeve) ? sleeve : [sleeve],
            fabric: Array.isArray(fabric) ? fabric : [fabric],
            tags: Array.isArray(tags) ? tags : [tags],
            work_type,
            props: Array.isArray(props) ? props : [props]
        });
    }
};

const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_DIR = path.join(__dirname, '../../static/images/designs');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper: Save Base64 or Binary Image
const saveBase64Image = (base64String) => {
    if (!base64String || !base64String.includes('base64,')) return base64String;
    
    try {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${uuidv4()}.jpg`;
        const filepath = path.join(UPLOADS_DIR, filename);
        
        fs.writeFileSync(filepath, buffer);
        return `/static/images/designs/${filename}`;
    } catch (err) {
        console.error("Error saving image:", err);
        return base64String;
    }
};

/**
 * GET /designs
 * Advanced filtering + pagination
 */
exports.getAllDesigns = async (req, res) => {
    const { 
        neck, sleeve, back, work, fabric, occasion, 
        page = 1, limit = 20, sort = 'newest'
    } = req.query;

    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM designs WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Filters
    if (neck) {
        query += ` AND neck_type = $${paramIndex++}`;
        params.push(neck);
    }
    if (sleeve) {
        query += ` AND sleeve_type = $${paramIndex++}`;
        params.push(sleeve);
    }
    if (back) {
        query += ` AND back_type = $${paramIndex++}`;
        params.push(back);
    }
    if (work) {
        query += ` AND work_type = $${paramIndex++}`;
        params.push(work);
    }
    if (fabric) {
        query += ` AND fabric = $${paramIndex++}`;
        params.push(fabric);
    }
    if (occasion) {
        query += ` AND occasion = $${paramIndex++}`;
        params.push(occasion);
    }

    // Sorting
    if (sort === 'trending') {
        query += ` ORDER BY views_count DESC, created_at DESC`;
    } else if (sort === 'popular') {
        query += ` ORDER BY wishlist_count DESC, created_at DESC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    // Pagination
// Separate query for total count to support pagination UI
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].total);

    // Apply pagination to the main query
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    try {
        const result = await pool.query(query, params);
        res.json({
            total: totalCount,
            count: result.rows.length,
            page: parseInt(page),
            limit: parseInt(limit),
            designs: result.rows
        });
    } catch (err) {
        console.error("Database Error (Fetching Designs):", err.message);
        res.status(500).json({ error: 'Failed to fetch designs', details: err.message });
    }
};

/**
 * GET /designs/trending
 * High-performance fetch for featured section
 */
exports.getTrendingDesigns = async (req, res) => {
    try {
        const query = 'SELECT * FROM designs ORDER BY views_count DESC, created_at DESC LIMIT 6';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trending designs' });
    }
};

/**
 * GET /projects/:id
 * Single Design Detail + View Track
 */
exports.getDesignById = async (req, res) => {
    const { id } = req.params;
    try {
        // Increment view count
        await pool.query('UPDATE designs SET views_count = views_count + 1 WHERE id = $1', [id]);
        
        // Track activity (anonymous if no user_id)
        const user_id = req.user ? req.user.id : null;
        await pool.query(
            'INSERT INTO user_activity (user_id, design_id, activity_type) VALUES ($1, $2, $3)',
            [user_id, id, 'view']
        );

        const result = await pool.query('SELECT * FROM designs WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * GET /designs/:id/similar
 */
exports.getSimilarDesigns = async (req, res) => {
    const { id } = req.params;

    try {
        const targetResult = await pool.query('SELECT neck_type, work_type, occasion FROM designs WHERE id = $1', [id]);
        if (targetResult.rows.length === 0) return res.status(404).json({ error: 'Design not found' });

        const { neck_type, work_type, occasion } = targetResult.rows[0];

        const similarResult = await pool.query(
            'SELECT * FROM designs WHERE id != $1 AND (neck_type = $2 OR work_type = $3 OR occasion = $4) LIMIT 4',
            [id, neck_type, work_type, occasion]
        );
        res.json(similarResult.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch similar designs' });
    }
};

/**
 * POST /designs/wishlist/:id
 * Track wishlist intent
 */
exports.trackWishlist = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE designs SET wishlist_count = wishlist_count + 1 WHERE id = $1', [id]);
        const user_id = req.user ? req.user.id : null;
        await pool.query(
            'INSERT INTO user_activity (user_id, design_id, activity_type) VALUES ($1, $2, $3)',
            [user_id, id, 'wishlist']
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Track failed' });
    }
};
/**
 * GET /designs/search?q=bridal+deep+back
 * Full-text search emulation via ILIKE
 */
exports.searchDesigns = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });

    const searchTerms = `%${q}%`;
    const query = `
        SELECT * FROM designs 
        WHERE title ILIKE $1 
        OR description ILIKE $1 
        OR neck_type ILIKE $1 
        OR work_type ILIKE $1
        ORDER BY created_at DESC
    `;

    try {
        const result = await pool.query(query, [searchTerms]);
        res.json(result.rows);
    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ error: 'Search failed' });
    }
};

/**
 * POST /designs
 * Admin upload
 */
exports.createDesign = async (req, res) => {
    const { 
        title, description, price, neck_type, sleeve_type, 
        back_type, work_type, fabric, occasion, images, is_customizable 
    } = req.body;
    
    // images is expected to be an array of base64 or URLs
    const processedImages = Array.isArray(images) 
        ? images.map(img => saveBase64Image(img)) 
        : [saveBase64Image(images)];
    
    try {
        const result = await pool.query(
            `INSERT INTO designs (
                title, description, price, neck_type, sleeve_type, 
                back_type, work_type, fabric, occasion, images, is_customizable
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                title, description, price, neck_type, sleeve_type, 
                back_type, work_type, fabric, occasion, JSON.stringify(processedImages), 
                is_customizable !== undefined ? is_customizable : true
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating design:", err);
        res.status(500).json({ error: 'Creation failed' });
    }
};

/**
 * POST /designs/estimate
 */
exports.estimatePrice = async (req, res) => {
    const { designId, config } = req.body;
    try {
        const designRes = await pool.query('SELECT price, work_type FROM designs WHERE id = $1', [designId]);
        if (designRes.rows.length === 0) return res.status(404).json({ error: 'Design not found' });

        const base = Number(designRes.rows[0].price) || 1500;
        let total = base;

        // Premium calculation logic
        if (config.neck_tweak && config.neck_tweak !== 'standard') total += 300;
        if (config.sleeve_length === 'full') total += 500;
        if (config.lining === 'silk') total += 800;
        
        // Complex work logic
        if (designRes.rows[0].work_type === 'aari' || designRes.rows[0].work_type === 'zardosi') {
            total += 1000; // Hand-work premium
        }

        res.json({ estimate: total, base });
    } catch (err) {
        res.status(500).json({ error: 'Estimation failed' });
    }
};

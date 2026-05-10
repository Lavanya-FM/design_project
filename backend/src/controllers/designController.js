const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_DIR = path.join(__dirname, '../../static/images/designs');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Removed saveBase64Image helper as images are uploaded via /api/upload

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
        query += ` ORDER BY trending_score DESC, views_count DESC`;
    } else if (sort === 'popular') {
        query += ` ORDER BY wishlist_count DESC, created_at DESC`;
    } else if (sort === 'price-low') {
        query += ` ORDER BY price ASC`;
    } else if (sort === 'price-high') {
        query += ` ORDER BY price DESC`;
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
    
    // Convert SELECT * to fetch normalized image
    query = query.replace('SELECT * FROM designs', `SELECT designs.*, 
        (SELECT url FROM design_images WHERE design_id = designs.id ORDER BY display_order LIMIT 1) as normalized_image 
        FROM designs`);
        
    params.push(limit, offset);

    try {
        const result = await pool.query(query, params);
        
        // Map normalized image
        const mappedDesigns = result.rows.map(d => ({
            ...d,
            image: d.normalized_image || d.images || d.image_url || ''
        }));

        res.json({
            total: totalCount,
            count: result.rows.length,
            page: parseInt(page),
            limit: parseInt(limit),
            designs: mappedDesigns
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
        const query = `
            SELECT d.*, 
            (SELECT url FROM design_images WHERE design_id = d.id ORDER BY display_order LIMIT 1) as normalized_image
            FROM designs d 
            ORDER BY views_count DESC, created_at DESC LIMIT 6
        `;
        const result = await pool.query(query);
        const mappedDesigns = result.rows.map(d => ({
            ...d,
            image: d.normalized_image || d.images || d.image_url || ''
        }));
        res.json(mappedDesigns);
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
        // Increment view count and trending score
        await pool.query('UPDATE designs SET views_count = views_count + 1, trending_score = trending_score + 0.1 WHERE id = $1', [id]);
        
        // Track activity (anonymous if no user_id)
        const user_id = req.user ? req.user.id : null;
        await pool.query(
            'INSERT INTO user_activity (user_id, design_id, activity_type) VALUES ($1, $2, $3)',
            [user_id, id, 'view']
        );

        const result = await pool.query('SELECT * FROM designs WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        
        const design = result.rows[0];

        // Fetch normalized data
        const imagesRes = await pool.query('SELECT url, tag FROM design_images WHERE design_id = $1 ORDER BY display_order', [id]);
        design.image_gallery = imagesRes.rows;
        design.image = imagesRes.rows[0]?.url || design.images || '';

        const tagsRes = await pool.query('SELECT tag_name FROM design_tags WHERE design_id = $1', [id]);
        design.tags = tagsRes.rows.map(r => r.tag_name);

        const customRes = await pool.query('SELECT customization_type, customization_value FROM design_customizations WHERE design_id = $1', [id]);
        design.customizations = customRes.rows;

        res.json(design);
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
        SELECT d.*, 
        (SELECT url FROM design_images WHERE design_id = d.id ORDER BY display_order LIMIT 1) as normalized_image
        FROM designs d
        WHERE title ILIKE $1 
        OR description ILIKE $1 
        OR neck_type ILIKE $1 
        OR work_type ILIKE $1
        ORDER BY created_at DESC
    `;

    try {
        const result = await pool.query(query, [searchTerms]);
        const mappedDesigns = result.rows.map(d => ({
            ...d,
            image: d.normalized_image || d.images || d.image_url || ''
        }));
        res.json(mappedDesigns);
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
    const title = req.body.title || req.body.name;
    const description = req.body.description || '';
    const price = req.body.price;
    const neck_type = req.body.neck_type || (Array.isArray(req.body.neck) ? req.body.neck[0] : req.body.neck) || '';
    const sleeve_type = req.body.sleeve_type || (Array.isArray(req.body.sleeve) ? req.body.sleeve[0] : req.body.sleeve) || '';
    const back_type = req.body.back_type || '';
    const work_type = req.body.work_type || '';
    const fabric = req.body.fabric || (Array.isArray(req.body.fabric) ? req.body.fabric[0] : req.body.fabric) || '';
    const occasion = req.body.occasion || req.body.category || '';
    const is_customizable = req.body.is_customizable !== undefined ? req.body.is_customizable : true;

    const id = uuidv4();
    
    try {
        // 1. Insert into designs
        await pool.query(
            `INSERT INTO designs (
                id, title, description, price, neck_type, sleeve_type, 
                back_type, work_type, fabric, occasion, is_customizable
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [id, title, description, price, neck_type, sleeve_type, back_type, work_type, fabric, occasion, is_customizable]
        );

        // 2. Insert into design_images
        let imageList = [];
        if (req.body.tags) {
            const imgTag = req.body.tags.find(t => typeof t === 'string' && t.startsWith('[') && t.includes('url'));
            if (imgTag) {
                try { imageList = JSON.parse(imgTag); } catch(e){}
            }
        }
        
        if (imageList.length === 0) {
             const singleImage = req.body.image || req.body.images;
             if (singleImage) {
                 if (Array.isArray(singleImage)) {
                     imageList = singleImage.map(url => ({ url, tag: 'Front View' }));
                 } else {
                     imageList = [{ url: singleImage, tag: 'Front View' }];
                 }
             }
        }

        for (let i = 0; i < imageList.length; i++) {
            await pool.query(
                `INSERT INTO design_images (id, design_id, url, tag, display_order) VALUES ($1, $2, $3, $4, $5)`,
                [uuidv4(), id, imageList[i].url || imageList[i], imageList[i].tag || 'Front View', i]
            );
        }

        // 3. Insert into design_tags
        const tags = Array.isArray(req.body.tags) ? req.body.tags.filter(t => typeof t === 'string' && !t.startsWith('[')) : [];
        for (const tag of tags) {
            await pool.query(
                `INSERT INTO design_tags (id, design_id, tag_name) VALUES ($1, $2, $3)`,
                [uuidv4(), id, tag]
            );
        }

        // 4. Insert into design_customizations
        const customizations = [
            { type: 'neck', value: neck_type },
            { type: 'sleeve', value: sleeve_type },
            { type: 'fabric', value: fabric }
        ];
        for (const c of customizations) {
             if (c.value) {
                 await pool.query(
                    `INSERT INTO design_customizations (id, design_id, customization_type, customization_value) VALUES ($1, $2, $3, $4)`,
                    [uuidv4(), id, c.type, c.value]
                 );
             }
        }

        res.status(201).json({ id, title, price, image: imageList[0]?.url, category: occasion });
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
/**
 * POST /designs/:id/review
 */
exports.addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment, target_type } = req.body;
    const user_id = req.user.id;

    try {
        const reviewId = uuidv4();
        await pool.query(
            'INSERT INTO reviews (id, user_id, target_id, target_type, rating, comment) VALUES ($1, $2, $3, $4, $5, $6)',
            [reviewId, user_id, id, target_type, rating, comment]
        );
        res.status(201).json({ success: true, id: reviewId });
    } catch (err) {
        res.status(500).json({ error: 'Review submission failed' });
    }
};

/**
 * PATCH /designs/:id/moderate (Admin Only)
 */
exports.moderateDesign = async (req, res) => {
    const { id } = req.params;
    const { status, moderation_note } = req.body;

    try {
        await pool.query(
            'UPDATE designs SET status = $1, moderation_note = $2 WHERE id = $3',
            [status, moderation_note, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Moderation failed' });
    }
};

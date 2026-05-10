const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./studio.db');

db.serialize(() => {
    // USERS TABLE
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        password_hash TEXT,
        role TEXT CHECK(role IN ('CUSTOMER', 'DESIGNER', 'TAILOR', 'VENDOR', 'ADMIN')),
        is_active BOOLEAN DEFAULT 1,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
    )`);

    // GUEST_SESSIONS
    db.run(`CREATE TABLE IF NOT EXISTS guest_sessions (
        id TEXT PRIMARY KEY,
        session_token TEXT UNIQUE,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ORDERS
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        guest_session_id TEXT,
        status TEXT DEFAULT 'DRAFT',
        stitching_stage TEXT,
        tailor_id TEXT,
        total_amount REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(guest_session_id) REFERENCES guest_sessions(id)
    )`);

    // CUSTOMIZATIONS
    db.run(`CREATE TABLE IF NOT EXISTS customizations (
        id TEXT PRIMARY KEY,
        order_id TEXT,
        config_json TEXT,
        preview_image_url TEXT,
        FOREIGN KEY(order_id) REFERENCES orders(id)
    )`);

    // NOTIFICATIONS
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        role TEXT,
        type TEXT,
        payload_json TEXT,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // DESIGNS (Integrated from Postgres requirement)
    db.run(`CREATE TABLE IF NOT EXISTS designs (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        price REAL,
        neck_type TEXT,
        sleeve_type TEXT,
        back_type TEXT,
        work_type TEXT,
        fabric TEXT,
        occasion TEXT,
        images TEXT,
        story_text TEXT,
        anatomy_json TEXT,
        artisan_name TEXT,
        reviews_json TEXT,
        is_customizable BOOLEAN DEFAULT 1,
        status TEXT DEFAULT 'PENDING' CHECK(status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED')),
        moderation_note TEXT,
        views_count INTEGER DEFAULT 0,
        wishlist_count INTEGER DEFAULT 0,
        trending_score REAL DEFAULT 0,
        tags TEXT, -- Comma separated tags
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // DESIGN_IMAGES
    db.run(`CREATE TABLE IF NOT EXISTS design_images (
        id TEXT PRIMARY KEY,
        design_id TEXT,
        url TEXT,
        tag TEXT,
        display_order INTEGER,
        FOREIGN KEY(design_id) REFERENCES designs(id)
    )`);

    // DESIGN_TAGS
    db.run(`CREATE TABLE IF NOT EXISTS design_tags (
        id TEXT PRIMARY KEY,
        design_id TEXT,
        tag_name TEXT,
        FOREIGN KEY(design_id) REFERENCES designs(id)
    )`);

    // DESIGN_CUSTOMIZATIONS
    db.run(`CREATE TABLE IF NOT EXISTS design_customizations (
        id TEXT PRIMARY KEY,
        design_id TEXT,
        customization_type TEXT,
        customization_value TEXT,
        FOREIGN KEY(design_id) REFERENCES designs(id)
    )`);

    // REVIEWS TABLE
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        target_id TEXT, -- design_id, tailor_id, or fabric_id
        target_type TEXT CHECK(target_type IN ('DESIGN', 'TAILOR', 'FABRIC')),
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // USER_ACTIVITY
    db.run(`CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        design_id TEXT,
        activity_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(design_id) REFERENCES designs(id)
    )`);

    // --- SEED INITIAL DATA ---
    db.get(`SELECT COUNT(*) as count FROM designs`, (err, row) => {
        if (!err && row.count === 0) {
            console.log("🌱 Seeding designs into SQLite...");
            const b011Anatomy = [
                { title: 'Base Fabric', desc: 'Pure Kanchipuram Silk sourced from weaving cooperatives in Tamil Nadu.' },
                { title: 'Lining', desc: 'Cotton Mulmul. Double layered for comfort against the skin.' },
                { title: 'Embellishment', desc: 'Hand-stitched Zardosi. Real metallic threads and semi-precious beads.' }
            ];

            const b011Reviews = [
                { author: 'Elena V.', location: 'London', rating: 5, text: "The weight of the silk and the brilliance of the gold zari is unlike anything I've seen in modern retail. Truly an heirloom piece." },
                { author: 'Khalli d.', location: 'Mumbai', rating: 5, text: "Feeling the virtual tailor was seamless. The blouse fits like a second skin. The craftsmanship is evident in every hidden seam." }
            ];

            const designs = [
                [
                    'B011', 'Royal Bridal Aari Blouse', 'Heavily embellished bridal blouse with intricate aari work and gold threads.', 4500, 'boat', 'short', 'knot', 'aari', 'silk', 'bridal',
                    '["/static/images/designs/bridal_aari_front.png", "/static/images/designs/bridal_aari_back.png"]',
                    'This Royal Bridal Aari Blouse begins its journey at the looms of Kanchipuram, where pure mulberry silk is fused with gold zari. Once the fabric arrives at our atelier, a master artisan spends over 60 hours hand-applying the intricate embroidery.',
                    JSON.stringify(b011Anatomy),
                    'Mubashir Pan',
                    JSON.stringify(b011Reviews)
                ],
                ['D002', 'Modern Halter Silk', 'Chic halter neck in raw silk for reception evening.', 2200, 'halter', 'sleeveless', 'open', 'plain', 'silk', 'reception', '[]', '', '[]', '', '[]'],
                ['P003', 'Zari Border Deep Neck', 'Traditional blouse with deep back and zari work for festivals.', 1800, 'deep_back', 'elbow', 'zip', 'zari', 'cotton', 'party', '[]', '', '[]', '', '[]']
            ];

            const stmt = db.prepare(`INSERT INTO designs (id, title, description, price, neck_type, sleeve_type, back_type, work_type, fabric, occasion, images, story_text, anatomy_json, artisan_name, reviews_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            designs.forEach(d => stmt.run(d));
            stmt.finalize();
        }
    });

    // CART ITEMS
    db.run(`CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        design_id TEXT,
        customization_json TEXT,
        measurements_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(design_id) REFERENCES designs(id)
    )`);

    // WISHLIST ITEMS
    db.run(`CREATE TABLE IF NOT EXISTS wishlist_items (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        design_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(design_id) REFERENCES designs(id),
        UNIQUE(user_id, design_id)
    )`);

    // INDEXES for Performance
    db.run(`CREATE TABLE IF NOT EXISTS order_status_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT,
        old_status TEXT,
        new_status TEXT,
        changed_by TEXT,
        comments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // INDEXES for Performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_designs_occasion ON designs(occasion)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_designs_status ON designs(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_designs_trending ON designs(trending_score)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`);

    console.log("✅ Fit & Flare Extended Schema (Optimized) Initialized.");
});

module.exports = db;

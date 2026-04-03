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
        customer_id TEXT,
        guest_session_id TEXT,
        status TEXT DEFAULT 'DRAFT',
        total_amount REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES users(id),
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
        views_count INTEGER DEFAULT 0,
        wishlist_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

    console.log("✅ Fit & Flare Production Schema Initialized.");
});

module.exports = db;

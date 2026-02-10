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

    console.log("✅ Fit & Flare Production Schema Initialized.");
});

module.exports = db;

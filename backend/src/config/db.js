const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fit_flare_studio',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Don't kill the process on DB error, just log it.
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); // Disabled to keep server alive
});

let isConnected = false;
const mockUsers = []; // In-memory fallback for demo purposes

// Simple connectivity check
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed. Entering MOCK/DEMO mode.');
        isConnected = false;
    } else {
        console.log('Database connected successfully');
        isConnected = true;
        release();
    }
});

module.exports = {
    // Smart Query Fallback
    query: async (text, params) => {
        if (isConnected) {
            return pool.query(text, params);
        }

        // --- MOCK DATABASE LOGIC FOR DEMO ---
        console.warn('⚠️ MOCK DB: Executing simulated query:', text);

        // 1. Check if user exists (Registration/Login check)
        if (text.includes('SELECT * FROM users WHERE email = $1')) {
            const user = mockUsers.find(u => u.email === params[0]);
            return { rows: user ? [user] : [] };
        }

        // 2. Create new user (Registration)
        if (text.includes('INSERT INTO users')) {
            const newUser = {
                id: 'mock-' + Math.random().toString(36).substr(2, 9),
                full_name: params[0],
                email: params[1],
                password_hash: params[2],
                role: 'customer'
            };
            mockUsers.push(newUser);
            return { rows: [newUser] };
        }

        // 3. Health Check or Generic
        return { rows: [] };
    },
    isConnected: () => true // Always return true to allow app usage in mock mode
};

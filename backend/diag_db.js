const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fit_flare_studio',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function check() {
    try {
        const res = await pool.query("SELECT to_regclass('public.users') as exists;");
        console.log('--- CHECK RESULTS ---');
        console.log('Result:', res.rows[0]);
        if (res.rows[0].exists) {
            const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users';");
            console.log('Columns:', columns.rows.map(c => c.column_name));
        } else {
            console.log('Table "users" does NOT exist.');
        }
        console.log('--- END CHECK ---');
    } catch (err) {
        console.error('--- ERROR ---');
        console.error(err.message);
        console.error('--- END ERROR ---');
    } finally {
        await pool.end();
    }
}

check();

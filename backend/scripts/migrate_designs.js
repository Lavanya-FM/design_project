const pool = require('../src/config/db');
const fs = require('fs');
const path = require('path');

async function migrate() {
    console.log('--- Starting Design System Migration ---');
    
    try {
        const schema = fs.readFileSync(path.join(__dirname, '../../database/new_designs_table.sql'), 'utf8');
        const activity = fs.readFileSync(path.join(__dirname, '../../database/activity_tracking.sql'), 'utf8');
        const customization = fs.readFileSync(path.join(__dirname, '../../database/customization_orders.sql'), 'utf8');
        const seed = fs.readFileSync(path.join(__dirname, '../../database/seed_designs.sql'), 'utf8');

        console.log('1. Applying new designs table schema...');
        await pool.query(schema);
        console.log('✅ Base Schema applied.');

        console.log('2. Applying Tracking & Customization schemas...');
        await pool.query(activity);
        await pool.query(customization);
        console.log('✅ Extension Schemas applied.');

        console.log('3. Seeding initial data...');
        // Check if data already exists to avoid duplicates in this simple script
        const check = await pool.query('SELECT count(*) FROM designs');
        if (parseInt(check.rows[0].count) === 0) {
            await pool.query(seed);
            console.log('✅ Seed data inserted.');
        } else {
            console.log('ℹ️ Seed data already exists, skipping.');
        }

        console.log('--- Migration Completed Successfully ---');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        console.error('Make sure PostgreSQL is running and DB_NAME="fit_flare_studio" exists.');
    } finally {
        process.exit();
    }
}

migrate();

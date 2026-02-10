const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fit_flare_studio',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function seed() {
    try {
        console.log('Seeding real initial data...');

        // 1. Initial Designs
        await pool.query(`
            INSERT INTO base_designs (name, description, category, image_url, base_price, complexity_level)
            VALUES 
            ('Royal Raw Silk U-Neck', 'Handcrafted elegance for weddings', 'Bridal', 'https://images.unsplash.com/photo-1594938298603-c8148c47e957?w=800', 4500, 'complex'),
            ('Premium Velvet Gala', 'Deep back party wear masterpiece', 'Party', 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800', 3200, 'medium'),
            ('Pure Cotton Keyhole', 'Daily wear comfort with a twist', 'Everyday', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 1200, 'simple'),
            ('Brocade Princess Cut', 'Traditional wedding classic', 'Bridal', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 5500, 'complex')
            ON CONFLICT DO NOTHING;
        `);

        // 2. Initial Fabrics
        await pool.query(`
            INSERT INTO fabrics (name, material_type, price_per_meter, stock_quantity, image_url)
            VALUES 
            ('Banarasi Silk - Crimson', 'Silk', 950, 25, 'https://images.unsplash.com/photo-1594938298603-c8148c47e957?w=400'),
            ('Midnight Black Velvet', 'Velvet', 1200, 15, 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=400'),
            ('Organic Cotton - Sage', 'Cotton', 450, 40, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400')
            ON CONFLICT DO NOTHING;
        `);

        console.log('Seed successful!');
    } catch (err) {
        console.error('Seed Error:', err.message);
    } finally {
        await pool.end();
    }
}

seed();

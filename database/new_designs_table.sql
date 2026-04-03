-- Unified Designs Table for performance and filtering
CREATE TABLE IF NOT EXISTS designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    is_customizable BOOLEAN DEFAULT TRUE,

    neck_type VARCHAR(50),        -- boat, deep_back, halter
    sleeve_type VARCHAR(50),      -- sleeveless, short, elbow
    back_type VARCHAR(50),        -- open, knot, zip
    work_type VARCHAR(50),        -- aari, embroidery, zari

    fabric VARCHAR(50),           -- silk, cotton
    occasion VARCHAR(50),         -- bridal, reception

    images JSONB,                 -- JSON array of URLs: ["url1.jpg", "url2.jpg"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_neck_type ON designs(neck_type);
CREATE INDEX IF NOT EXISTS idx_work_type ON designs(work_type);
CREATE INDEX IF NOT EXISTS idx_sleeve_type ON designs(sleeve_type);
CREATE INDEX IF NOT EXISTS idx_back_type ON designs(back_type);
CREATE INDEX IF NOT EXISTS idx_fabric ON designs(fabric);
CREATE INDEX IF NOT EXISTS idx_occasion ON designs(occasion);
CREATE INDEX IF NOT EXISTS idx_created_at ON designs(created_at);

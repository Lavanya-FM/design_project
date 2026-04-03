-- Customization Orders Table
CREATE TABLE IF NOT EXISTS customizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    config JSONB NOT NULL, -- { neck_tweak, back_tweak, sleeve_length, etc }
    measurements JSONB NOT NULL, -- { chest, waist, shoulder, etc }
    notes TEXT,
    price_estimated DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, confirmed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cust_user ON customizations(user_id);
CREATE INDEX IF NOT EXISTS idx_cust_design ON customizations(design_id);

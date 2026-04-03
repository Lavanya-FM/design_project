-- FIT & FLARE - ORDER EXECUTION & FULFILLMENT SCHEMA
-- Adds tracking, communication, and trust layers

-- 1. Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by UUID REFERENCES users(id),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Order Messages (Chat/Communication)
CREATE TABLE IF NOT EXISTS order_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    message_text TEXT NOT NULL,
    attachment_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Ratings & Feedback (Trust Engine)
CREATE TABLE IF NOT EXISTS order_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), -- Reviewer
    designer_id UUID REFERENCES users(id), -- Subject (or tailor_id)
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tracking ID & Designer Link (Update existing orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS designer_id UUID REFERENCES users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(100);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_msg_order ON order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_status_order ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_ratings_designer ON order_ratings(designer_id);

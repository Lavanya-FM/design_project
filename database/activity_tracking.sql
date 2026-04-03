-- Performance & Behavior Tracking Extensions
ALTER TABLE designs ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE designs ADD COLUMN IF NOT EXISTS wishlist_count INTEGER DEFAULT 0;

-- User Activity Logging
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Null for guests
    design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) CHECK (activity_type IN ('view', 'wishlist', 'click')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_design_id ON user_activity(design_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON user_activity(created_at);

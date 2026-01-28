-- User Watched Items Table Migration
-- Add this to your existing auth-migration.sql or run separately

-- Create user_watched table
CREATE TABLE IF NOT EXISTS user_watched (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('movie', 'tv')),
    item_data JSONB NOT NULL,
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id, item_type)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_watched_user_id ON user_watched(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watched_type ON user_watched(item_type);
CREATE INDEX IF NOT EXISTS idx_user_watched_at ON user_watched(watched_at DESC);

-- Enable Row Level Security
ALTER TABLE user_watched ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies
DROP POLICY IF EXISTS "Users can view own watched items" ON user_watched;
CREATE POLICY "Users can view own watched items"
    ON user_watched FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own watched items" ON user_watched;
CREATE POLICY "Users can insert own watched items"
    ON user_watched FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own watched items" ON user_watched;
CREATE POLICY "Users can delete own watched items"
    ON user_watched FOR DELETE
    USING (auth.uid() = user_id);

-- Verification
SELECT 'User watched table created successfully!' as status;

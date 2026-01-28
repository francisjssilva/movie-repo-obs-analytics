-- User Favorites Table Migration
-- Run this in Supabase SQL Editor after enabling authentication

-- Enable Row Level Security
ALTER TABLE IF EXISTS user_favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing table if you want to recreate
-- DROP TABLE IF EXISTS user_favorites CASCADE;

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    movie_id TEXT NOT NULL,
    movie_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_favorites_updated_at ON user_favorites;
CREATE TRIGGER update_user_favorites_updated_at
    BEFORE UPDATE ON user_favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
-- Users can only see their own favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON user_favorites;
CREATE POLICY "Users can view own favorites"
    ON user_favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own favorites
DROP POLICY IF EXISTS "Users can insert own favorites" ON user_favorites;
CREATE POLICY "Users can insert own favorites"
    ON user_favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own favorites
DROP POLICY IF EXISTS "Users can update own favorites" ON user_favorites;
CREATE POLICY "Users can update own favorites"
    ON user_favorites FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own favorites
DROP POLICY IF EXISTS "Users can delete own favorites" ON user_favorites;
CREATE POLICY "Users can delete own favorites"
    ON user_favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Verification
SELECT 'User favorites table created successfully!' as status;
SELECT COUNT(*) as row_count FROM user_favorites;

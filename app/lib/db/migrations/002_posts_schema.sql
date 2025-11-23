-- Posts Schema for Social Feed
-- Run this in Supabase SQL Editor after 001_initial_schema.sql

-- Posts table: Stores social feed posts from all users
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  namespace TEXT NOT NULL,
  village TEXT NOT NULL,
  text TEXT NOT NULL,
  image_blob_id TEXT, -- Walrus blob ID for image
  image_url TEXT, -- Fallback URL if not using Walrus
  post_type TEXT DEFAULT 'regular', -- 'regular', 'purchase', 'gift-bottle', 'send-tokens'
  activity_data JSONB, -- Additional data for activity posts (purchases, gifts, etc.)
  cork_earned INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_village ON posts(village);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_namespace ON posts(namespace);

-- Create index for feed queries (village + created_at)
CREATE INDEX IF NOT EXISTS idx_posts_village_created_at ON posts(village, created_at DESC);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for hackathon - can restrict later)
CREATE POLICY "Allow all operations on posts" ON posts
  FOR ALL USING (true) WITH CHECK (true);

-- Create a view for feed posts with user info
CREATE OR REPLACE VIEW feed_posts AS
SELECT 
  p.id,
  p.user_id,
  u.wallet_address,
  u.username,
  u.profile_pic_blob_id,
  p.namespace,
  p.village,
  p.text,
  p.image_blob_id,
  p.image_url,
  p.post_type,
  p.activity_data,
  p.cork_earned,
  p.likes,
  p.comments,
  p.created_at,
  p.updated_at,
  EXTRACT(EPOCH FROM p.created_at) * 1000 as timestamp -- JavaScript timestamp
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;


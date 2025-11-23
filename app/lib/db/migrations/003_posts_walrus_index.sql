-- Posts Walrus Index Schema
-- Run this after 002_posts_schema.sql
-- This changes posts storage: content on Walrus, index in Supabase

-- Update posts table to store Walrus blob IDs instead of full content
ALTER TABLE posts 
  ADD COLUMN IF NOT EXISTS walrus_blob_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS content_hash TEXT; -- For deduplication

-- Create index on walrus_blob_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_posts_walrus_blob_id ON posts(walrus_blob_id);

-- Create index on content_hash to prevent duplicates
CREATE INDEX IF NOT EXISTS idx_posts_content_hash ON posts(content_hash);

-- Migrate existing posts (if any) - keep text column for now as fallback
-- Posts will be migrated to Walrus on next update

-- Update the feed_posts view to include walrus_blob_id
DROP VIEW IF EXISTS feed_posts;

CREATE OR REPLACE VIEW feed_posts AS
SELECT 
  p.id,
  p.user_id,
  u.wallet_address,
  u.username,
  u.profile_pic_blob_id,
  p.namespace,
  p.village,
  p.text, -- Fallback for old posts
  p.walrus_blob_id, -- New: Walrus blob ID
  p.image_blob_id,
  p.image_url,
  p.post_type,
  p.activity_data,
  p.cork_earned,
  p.likes,
  p.comments,
  p.created_at,
  p.updated_at,
  EXTRACT(EPOCH FROM p.created_at) * 1000 as timestamp
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;


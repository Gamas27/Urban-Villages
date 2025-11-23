-- Initial Database Schema for Cork Collective Hackathon Backend
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table: Stores user profiles and onboarding state
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  village TEXT,
  namespace_id TEXT,
  profile_pic_blob_id TEXT,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on wallet_address for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Create index on onboarding completion for analytics
CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed ON users(onboarding_completed_at) WHERE onboarding_completed_at IS NOT NULL;

-- Onboarding events table: Tracks onboarding steps for analytics
CREATE TABLE IF NOT EXISTS onboarding_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id and event_type for analytics queries
CREATE INDEX IF NOT EXISTS idx_onboarding_events_user_id ON onboarding_events(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_events_type ON onboarding_events(event_type);
CREATE INDEX IF NOT EXISTS idx_onboarding_events_created_at ON onboarding_events(created_at);

-- Transactions table: Tracks blockchain transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  transaction_digest TEXT NOT NULL,
  nft_id TEXT,
  token_amount BIGINT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_digest ON transactions(transaction_digest);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- NFT ownership table: Tracks NFT ownership
CREATE TABLE IF NOT EXISTS nft_ownership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nft_id TEXT UNIQUE NOT NULL,
  bottle_number INTEGER,
  wine_name TEXT,
  village TEXT,
  minted_at TIMESTAMPTZ,
  transaction_digest TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_nft_ownership_user_id ON nft_ownership(user_id);
CREATE INDEX IF NOT EXISTS idx_nft_ownership_nft_id ON nft_ownership(nft_id);
CREATE INDEX IF NOT EXISTS idx_nft_ownership_village ON nft_ownership(village);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - allow all for hackathon (can restrict later)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_ownership ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for hackathon - restrict later if needed)
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on onboarding_events" ON onboarding_events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on transactions" ON transactions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on nft_ownership" ON nft_ownership
  FOR ALL USING (true) WITH CHECK (true);

-- Create a view for user statistics (useful for analytics)
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.wallet_address,
  u.username,
  u.village,
  u.onboarding_completed_at,
  COUNT(DISTINCT t.id) as transaction_count,
  COUNT(DISTINCT n.id) as nft_count,
  COUNT(DISTINCT oe.id) as event_count
FROM users u
LEFT JOIN transactions t ON t.user_id = u.id
LEFT JOIN nft_ownership n ON n.user_id = u.id
LEFT JOIN onboarding_events oe ON oe.user_id = u.id
GROUP BY u.id, u.wallet_address, u.username, u.village, u.onboarding_completed_at;

-- Grant permissions (adjust as needed based on your security requirements)
-- For now, allowing all operations through RLS policies above


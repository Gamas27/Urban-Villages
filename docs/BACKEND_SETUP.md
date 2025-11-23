# Backend Setup for Hackathon Testing

## Overview

Adding a backend to track user onboarding, blockchain transactions, and provide analytics for the hackathon demo. Since you're deploying to Vercel, we're using **Supabase** (PostgreSQL) which integrates seamlessly with Next.js.

## Why Supabase?

✅ **Free tier** - Perfect for hackathon  
✅ **Instant setup** - Get database in 2 minutes  
✅ **Built-in auth** (optional - we'll use Enoki for now)  
✅ **Real-time subscriptions** - Great for live demo  
✅ **TypeScript SDK** - Full type safety  
✅ **Vercel-compatible** - No extra config needed  

## Alternative Options

### Option 1: Vercel Postgres (Native)
- Native Vercel integration
- Slightly more complex setup
- Requires Vercel Pro plan for better features

### Option 2: MongoDB Atlas (NoSQL)
- Good if you prefer NoSQL
- Free tier available
- Requires additional setup

**Recommendation: Supabase** for fastest setup

---

## Setup Steps

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Create new project:
   - Name: `cork-collective-hackathon`
   - Database password: (save this!)
   - Region: Choose closest to users
4. Wait ~2 minutes for setup

### 2. Get Connection Details

1. Go to Project Settings → API
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to Database → Connection String
   - Copy connection string → `SUPABASE_DB_URL` (server-side only!)

### 3. Install Dependencies

```bash
pnpm add @supabase/supabase-js
pnpm add -D @types/node
```

### 4. Set Environment Variables

Add to `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
```

Add to Vercel:
- Go to Vercel Dashboard → Settings → Environment Variables
- Add the same variables (mark `SUPABASE_DB_URL` as server-side only)

### 5. Run Database Migrations

See `/app/lib/db/migrations/001_initial_schema.sql` - run this in Supabase SQL Editor.

---

## Database Schema

### Tables

#### `users`
Tracks user profiles and onboarding state
```sql
- id (uuid, primary key)
- wallet_address (text, unique) - From Enoki
- username (text) - From namespace
- village (text) - Selected village
- namespace_id (text) - SUI namespace ID
- profile_pic_blob_id (text) - Walrus blob ID
- onboarding_completed_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `onboarding_events`
Tracks onboarding steps for analytics
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → users.id)
- event_type (text) - 'wallet_connected', 'village_selected', 'namespace_claimed', 'profile_pic_uploaded', 'completed'
- metadata (jsonb) - Additional event data
- created_at (timestamp)
```

#### `transactions`
Tracks blockchain transactions
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → users.id)
- transaction_type (text) - 'purchase', 'mint_nft', 'mint_token', 'namespace_claim'
- transaction_digest (text) - SUI transaction digest
- nft_id (text) - Created NFT ID (if applicable)
- token_amount (bigint) - CORK tokens minted/burned
- metadata (jsonb) - Transaction details
- created_at (timestamp)
```

#### `nft_ownership`
Tracks NFT ownership (updated on-chain)
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → users.id)
- nft_id (text, unique) - SUI object ID
- bottle_number (integer)
- wine_name (text)
- village (text)
- minted_at (timestamp)
- transaction_digest (text)
- created_at (timestamp)
```

---

## API Routes

### `/api/users/profile` (GET)
Get user profile by wallet address

### `/api/users/profile` (POST)
Create/update user profile

### `/api/users/onboarding/track` (POST)
Track onboarding event

### `/api/users/transactions` (POST)
Log blockchain transaction

### `/api/users/stats` (GET)
Get user statistics (for dashboard)

### `/api/admin/analytics` (GET)
Get hackathon analytics (total users, onboarding completion rate, etc.)

---

## Integration Points

### 1. Onboarding Flow
After user completes onboarding:
```typescript
// In Onboarding.tsx after onComplete()
await fetch('/api/users/profile', {
  method: 'POST',
  body: JSON.stringify({
    walletAddress: account.address,
    username,
    village,
    profilePicBlobId,
    namespaceId,
  }),
});

// Track completion
await fetch('/api/users/onboarding/track', {
  method: 'POST',
  body: JSON.stringify({
    eventType: 'completed',
    metadata: { step: 5 },
  }),
});
```

### 2. Purchase/Mint Flow
After NFT purchase:
```typescript
// In mint-purchase/route.ts after successful mint
await logTransaction({
  userId: user.id,
  transactionType: 'purchase',
  transactionDigest: result.digest,
  nftId,
  tokenAmount: corkAmount,
});
```

### 3. Real-time Analytics
For live demo, use Supabase real-time:
```typescript
const { data } = await supabase
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);

// Subscribe to new users in real-time
supabase
  .channel('users')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'users' }, (payload) => {
    console.log('New user:', payload.new);
  })
  .subscribe();
```

---

## Analytics Dashboard (Optional)

Create a simple admin page at `/admin/analytics`:
- Total users
- Onboarding completion rate
- Transactions per hour
- Village distribution
- NFT minting stats

---

## Testing Strategy

### For Hackathon Users:
1. Users complete onboarding → tracked in database
2. Each blockchain transaction → logged
3. Real-time stats visible in admin dashboard
4. Can track:
   - How many users completed onboarding
   - Average time to complete
   - Drop-off points
   - Transaction success rate

---

## Deployment Checklist

- [ ] Create Supabase project
- [ ] Set environment variables in Vercel
- [ ] Run database migrations
- [ ] Test API routes locally
- [ ] Add tracking calls to onboarding flow
- [ ] Add tracking to purchase flow
- [ ] Create analytics dashboard (optional)
- [ ] Test with real users

---

## Cost Estimate

**Supabase Free Tier:**
- 500MB database storage
- 2GB bandwidth
- 50,000 monthly active users
- Perfect for hackathon! 🎉

---

## Quick Start

1. **Set up Supabase** (5 min)
2. **Run migrations** (1 min)
3. **Add environment variables** (2 min)
4. **Deploy** - Backend is ready!

Total setup time: **~10 minutes** ⚡


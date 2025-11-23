# Backend Quick Start Guide

## Answer: How difficult is it to add a backend?

**TL;DR: Very easy! ~10 minutes setup, already done! ✅**

Since you're deploying to Vercel with Next.js, you already have a backend via **API Routes**. We've added:

1. ✅ **Database** - Supabase (PostgreSQL) setup
2. ✅ **API Routes** - User tracking, analytics endpoints  
3. ✅ **Integration helpers** - Easy-to-use tracking functions
4. ✅ **Migrations** - Database schema ready to deploy

---

## What's Included

### ✅ Already Set Up

- **Database Schema** (`app/lib/db/migrations/001_initial_schema.sql`)
  - Users table
  - Onboarding events tracking
  - Transaction logging
  - NFT ownership tracking

- **API Routes** (`app/api/`)
  - `/api/users/profile` - Create/update user profiles
  - `/api/users/onboarding/track` - Track onboarding steps
  - `/api/users/transactions` - Log blockchain transactions
  - `/api/admin/analytics` - Get hackathon statistics

- **Helper Functions** (`app/lib/api/userTracking.ts`)
  - `trackOnboardingEvent()` - Track onboarding steps
  - `saveUserProfile()` - Save user data
  - `logTransaction()` - Log blockchain transactions
  - `getAnalytics()` - Get statistics

---

## Setup Steps (10 minutes)

### 1. Create Supabase Project (5 min)

1. Go to https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - Name: `cork-collective-hackathon`
   - Database Password: (save this!)
   - Region: Choose closest
5. Wait ~2 minutes for setup

### 2. Get Credentials (2 min)

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Database** → **Connection String**
   - Copy **URI** → `SUPABASE_DB_URL`

### 3. Run Migration (1 min)

1. Go to **SQL Editor** in Supabase
2. Copy contents of `app/lib/db/migrations/001_initial_schema.sql`
3. Paste and click **Run**
4. ✅ Tables created!

### 4. Set Environment Variables (2 min)

**Local (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_DB_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
```

**Vercel:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add the 3 variables above
3. Mark `SUPABASE_DB_URL` as **Server-side only**
4. Redeploy

---

## Usage Examples

### Track Onboarding Completion

```typescript
import { saveUserProfile, trackOnboardingEvent } from '@/app/lib/api/userTracking';

// After user completes onboarding
await saveUserProfile({
  walletAddress: account.address,
  username: 'maria',
  village: 'lisbon',
  namespaceId: '0x123...',
  profilePicBlobId: 'blob-xxx',
  onboardingCompleted: true,
});

await trackOnboardingEvent(account.address, 'completed');
```

### Log Purchase Transaction

```typescript
import { logTransaction } from '@/app/lib/api/userTracking';

// After successful NFT purchase
await logTransaction({
  walletAddress: recipient,
  transactionType: 'purchase',
  transactionDigest: result.digest,
  nftId: nftId,
  tokenAmount: 50,
  metadata: { wineName: 'Orange Wine', village: 'lisbon' },
});
```

### View Analytics

```typescript
import { getAnalytics } from '@/app/lib/api/userTracking';

const stats = await getAnalytics('all');
console.log(stats.totals.users); // Total users
console.log(stats.totals.completedOnboarding); // Completed onboarding
console.log(stats.totals.transactions); // Total transactions
```

Or visit: `https://your-app.vercel.app/api/admin/analytics`

---

## What You Can Track

### User Metrics
- ✅ Total users
- ✅ Onboarding completion rate
- ✅ Time to complete onboarding
- ✅ Drop-off points (which step users abandon)

### Blockchain Metrics
- ✅ Total transactions
- ✅ NFTs minted
- ✅ CORK tokens distributed
- ✅ Transaction success rate

### Engagement Metrics
- ✅ Village distribution (Lisbon vs Porto vs Berlin)
- ✅ Active users per hour/day
- ✅ Most popular wines

---

## Integration Points

See `docs/BACKEND_INTEGRATION_EXAMPLES.md` for detailed integration examples:

1. **Onboarding Flow** - Track completion and steps
2. **Purchase Flow** - Log NFT mints and transactions
3. **Namespace Registration** - Track namespace claims

---

## Cost

**Supabase Free Tier:**
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users
- **Perfect for hackathon!** 🎉

---

## Testing

1. **Complete onboarding** with test wallet
2. **Check database**: Go to Supabase → Table Editor → `users`
3. **Make purchase** → Check `transactions` table
4. **View analytics**: Visit `/api/admin/analytics`

---

## Next Steps

1. ✅ Set up Supabase (5 min)
2. ✅ Run migration (1 min)
3. ✅ Add env vars (2 min)
4. ⏭️ Integrate tracking (15 min - see integration examples)
5. ✅ Deploy to Vercel
6. 🎉 Track hackathon users!

---

## Files Created

- `app/lib/db/supabase.ts` - Supabase client setup
- `app/lib/db/migrations/001_initial_schema.sql` - Database schema
- `app/lib/api/userTracking.ts` - Helper functions
- `app/api/users/profile/route.ts` - User profile API
- `app/api/users/onboarding/track/route.ts` - Onboarding tracking API
- `app/api/users/transactions/route.ts` - Transaction logging API
- `app/api/admin/analytics/route.ts` - Analytics API

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction
- **Integration Examples**: See `docs/BACKEND_INTEGRATION_EXAMPLES.md`

---

**Ready to test with hackathon users!** 🚀


# Backend Integration Examples

This document shows how to integrate the backend tracking into your existing flows.

## 1. Onboarding Flow Integration

### Update `app/cork/Onboarding.tsx`

After user completes onboarding, add tracking:

```typescript
import { trackOnboardingEvent, saveUserProfile } from '@/app/lib/api/userTracking';

// In the handleComplete function, after onComplete is called:
const handleComplete = async () => {
  if (!selectedVillage || !username || !account) return;
  
  const onboardingData = {
    username,
    village: selectedVillage.id,
    profilePicBlobId: profilePicBlobId || undefined,
  };
  
  // Save profile to backend
  await saveUserProfile({
    walletAddress: account.address,
    username,
    village: selectedVillage.id,
    profilePicBlobId: profilePicBlobId || undefined,
    onboardingCompleted: true,
  });
  
  // Track completion event
  await trackOnboardingEvent(account.address, 'completed', {
    village: selectedVillage.id,
    username,
    step: 5,
  });
  
  // Continue with existing flow
  onComplete(onboardingData);
};
```

### Track Individual Steps

```typescript
// When wallet connects
useEffect(() => {
  if (account?.address) {
    trackOnboardingEvent(account.address, 'wallet_connected');
  }
}, [account?.address]);

// When village is selected
const handleVillageSelect = (village: Village) => {
  setSelectedVillage(village);
  if (account?.address) {
    trackOnboardingEvent(account.address, 'village_selected', {
      villageId: village.id,
      villageName: village.name,
    });
  }
};

// When namespace is claimed
const handleNamespaceClaim = async (namespaceId: string) => {
  // ... existing namespace claim logic ...
  
  if (account?.address) {
    await trackOnboardingEvent(account.address, 'namespace_claimed', {
      namespaceId,
      namespace: `${username}.${village}`,
    });
  }
};

// When profile pic is uploaded
const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // ... existing upload logic ...
  
  if (result?.blobId && account?.address) {
    await trackOnboardingEvent(account.address, 'profile_pic_uploaded', {
      blobId: result.blobId,
    });
  }
};
```

---

## 2. Purchase/Mint Flow Integration

### Update `app/api/mint-purchase/route.ts`

After successful mint, log the transaction:

```typescript
import { logTransaction } from '@/app/lib/api/userTracking';

// After successful transaction (around line 175):
// Log the transaction to backend
await logTransaction({
  walletAddress: recipient,
  transactionType: 'purchase',
  transactionDigest: result.digest,
  nftId: nftId || undefined,
  tokenAmount: corkAmount || 50,
  metadata: {
    bottleNumber,
    wineName,
    vintage,
    region,
    winery,
    wineType,
    totalSupply,
  },
}).catch((err) => {
  // Don't fail the purchase if logging fails
  console.error('Failed to log transaction:', err);
});

return NextResponse.json({
  success: true,
  digest: result.digest,
  nftId,
  adminAddress,
});
```

---

## 3. Namespace Registration Integration

### Update `app/lib/namespace.ts`

After namespace is registered, log the transaction:

```typescript
import { logTransaction, saveUserProfile } from '@/app/lib/api/userTracking';

// In the registerNamespace function:
export async function registerNamespace(
  username: string,
  village: string,
  profilePicBlobId?: string,
  walletAddress?: string
) {
  // ... existing namespace registration logic ...
  
  if (result.digest && walletAddress) {
    // Log the transaction
    await logTransaction({
      walletAddress,
      transactionType: 'namespace_claim',
      transactionDigest: result.digest,
      metadata: {
        username,
        village,
        namespace: `${username}.${village}`,
      },
    });
    
    // Update user profile with namespace ID
    await saveUserProfile({
      walletAddress,
      namespaceId: result.namespaceId,
      username,
      village,
      profilePicBlobId,
    });
  }
  
  return result;
}
```

---

## 4. Analytics Dashboard (Optional)

Create a simple analytics page at `app/admin/analytics/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/app/lib/api/userTracking';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await getAnalytics('all');
    setAnalytics(data);
    setLoading(false);
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>Failed to load analytics</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Hackathon Analytics</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Total Users</h3>
          <p className="text-3xl font-bold">{analytics.totals.users}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Completed Onboarding</h3>
          <p className="text-3xl font-bold">{analytics.totals.completedOnboarding}</p>
          <p className="text-sm text-gray-500">{analytics.totals.completionRate}%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">Transactions</h3>
          <p className="text-3xl font-bold">{analytics.totals.transactions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600">NFTs Minted</h3>
          <p className="text-3xl font-bold">{analytics.totals.nfts}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Village Distribution</h3>
          <ul className="space-y-2">
            {Object.entries(analytics.distribution.villages).map(([village, count]) => (
              <li key={village} className="flex justify-between">
                <span>{village}</span>
                <span className="font-semibold">{count as number}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <ul className="space-y-2">
            {analytics.recent.users.slice(0, 5).map((user: any) => (
              <li key={user.id} className="text-sm">
                <span className="font-semibold">{user.username || 'Anonymous'}</span>
                <span className="text-gray-500 ml-2">- {user.wallet_address.slice(0, 8)}...</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Quick Integration Checklist

- [ ] **Set up Supabase** (5 min)
  - Create project at supabase.com
  - Copy connection details
  - Add to `.env.local`

- [ ] **Run migrations** (1 min)
  - Copy SQL from `app/lib/db/migrations/001_initial_schema.sql`
  - Run in Supabase SQL Editor

- [ ] **Install dependencies** (already done)
  - `@supabase/supabase-js` ✅

- [ ] **Add environment variables to Vercel**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_DB_URL` (server-side only)

- [ ] **Integrate tracking** (15 min)
  - [ ] Add to onboarding completion
  - [ ] Add to purchase flow
  - [ ] Add to namespace registration
  - [ ] Add step-by-step tracking (optional)

- [ ] **Test locally**
  - Complete onboarding → check database
  - Make purchase → check transaction log
  - View analytics endpoint

- [ ] **Deploy to Vercel**
  - Environment variables already set
  - Should work automatically!

---

## Testing

### Test Onboarding Tracking

1. Complete onboarding with a test wallet
2. Check database:
   ```sql
   SELECT * FROM users WHERE wallet_address = 'your_test_address';
   SELECT * FROM onboarding_events WHERE user_id = 'user_id';
   ```

### Test Transaction Logging

1. Make a purchase/mint
2. Check database:
   ```sql
   SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
   SELECT * FROM nft_ownership ORDER BY created_at DESC LIMIT 5;
   ```

### Test Analytics

1. Visit `/api/admin/analytics` in browser
2. Should return JSON with stats

---

## Notes

- All tracking is **non-blocking** - if tracking fails, the app continues
- Tracking errors are logged but don't break user flows
- Database can handle thousands of users (Supabase free tier)
- Analytics can be viewed in real-time via Supabase dashboard or API


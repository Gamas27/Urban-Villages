# Zustand Stores Summary

## ✅ Stores You Have Now

### 1. **User Store** (`userStore.ts`) - Existing ✅
- Profile and onboarding data
- Persists to sessionStorage
- Used throughout the app

### 2. **Blockchain Store** (`blockchainStore.ts`) - New! 🆕
- **CORK token balance** (cached 30s)
- **NFT ownership** (cached 30s)
- **Transaction tracking** (pending/success/failed)
- Auto-refresh capability

### 3. **Backend Store** (`backendStore.ts`) - New! 🆕
- **Backend profile sync** (Supabase)
- **Sync status** tracking
- **Cache management** (1 minute)

### 4. **Centralized Exports** (`index.ts`) - New! 🆕
- All stores exported from one place
- Easy imports: `import { useCorkBalance } from '@/lib/stores'`

---

## Quick Usage Examples

### Get CORK Balance
```typescript
import { useCorkBalance, useBlockchainStore } from '@/lib/stores';

const balance = useCorkBalance(); // Current balance (cached)
const { fetchCorkBalance } = useBlockchainStore();

// Fetch from blockchain
await fetchCorkBalance(walletAddress);
```

### Get Owned NFTs
```typescript
import { useOwnedNFTs, useBlockchainStore } from '@/lib/stores';

const nfts = useOwnedNFTs(); // Current NFTs (cached)
const { fetchOwnedNFTs } = useBlockchainStore();

// Fetch from blockchain
await fetchOwnedNFTs(walletAddress);
```

### Track Transaction
```typescript
import { useBlockchainStore } from '@/lib/stores';

const { addTransaction, updateTransaction } = useBlockchainStore();

// Start transaction
const txId = addTransaction({
  type: 'purchase',
  status: 'pending',
});

// Update on success
updateTransaction(txId, {
  status: 'success',
  digest: transactionDigest,
  metadata: { nftId: '0x123...' },
});
```

### Sync to Backend
```typescript
import { useBackendStore } from '@/lib/stores';

const { syncProfile, fetchBackendProfile } = useBackendStore();

// Sync profile to backend
await syncProfile({
  walletAddress: '0xabc...',
  username: 'maria',
  village: 'lisbon',
  onboardingCompleted: true,
});

// Fetch from backend
await fetchBackendProfile(walletAddress);
```

---

## Complete Integration Example

```typescript
'use client';

import { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  useUserProfile,
  useCorkBalance,
  useOwnedNFTs,
  useBackendProfile,
  useBlockchainStore,
  useBackendStore,
} from '@/lib/stores';

export function Dashboard() {
  const account = useCurrentAccount();
  const walletAddress = account?.address;

  // Get data from stores
  const profile = useUserProfile();
  const corkBalance = useCorkBalance();
  const nfts = useOwnedNFTs();
  const backendProfile = useBackendProfile();

  // Get actions
  const { refreshAll } = useBlockchainStore();
  const { fetchBackendProfile } = useBackendStore();

  // Load data on mount
  useEffect(() => {
    if (!walletAddress) return;

    // Load blockchain state (CORK + NFTs)
    refreshAll(walletAddress);

    // Load backend profile
    fetchBackendProfile(walletAddress);
  }, [walletAddress]);

  return (
    <div>
      <h1>@{profile?.username}</h1>
      <p>CORK Balance: {corkBalance}</p>
      <p>NFTs Owned: {nfts.length}</p>
      <p>Backend Synced: {backendProfile ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

---

## Store Features

✅ **Caching** - Reduces API calls (30s for blockchain, 1min for backend)  
✅ **Loading States** - Track loading in UI  
✅ **Error Handling** - Track and display errors  
✅ **Optimistic Updates** - Add transactions before confirmation  
✅ **Auto-refresh** - Refresh all data with one call  
✅ **TypeScript** - Full type safety  

---

## Files Created

- ✅ `app/lib/stores/blockchainStore.ts` - Blockchain state management
- ✅ `app/lib/stores/backendStore.ts` - Backend sync management
- ✅ `app/lib/stores/index.ts` - Centralized exports
- ✅ `docs/STORE_ARCHITECTURE.md` - Full documentation
- ✅ `docs/STORE_SUMMARY.md` - This file

---

## What's Complete

✅ **User Store** - Profile and onboarding  
✅ **Blockchain Store** - CORK, NFTs, transactions  
✅ **Backend Store** - Backend sync  
✅ **Integration** - All stores work together  

**Your frontend-to-backend-to-blockchain integration is complete!** 🚀


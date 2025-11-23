# Store Architecture - Frontend to Backend to Blockchain Integration

## Overview

Your Zustand stores now provide complete state management for the full integration:

1. **User Store** - Onboarding and profile data (local + sessionStorage)
2. **Blockchain Store** - CORK tokens, NFTs, transactions (blockchain + cache)
3. **Backend Store** - Backend sync and profile data (Supabase)

---

## Store Structure

### 1. User Store (`userStore.ts`) ✅

**Purpose**: Manages user profile and onboarding state

**Data**:
- `profile`: UserProfile (username, village, namespaceId, walletAddress)
- `loading`: Loading state
- `error`: Error messages

**Persistence**: sessionStorage

**Usage**:
```typescript
import { useUserProfile, useUserNamespace, useUserVillage } from '@/lib/stores';

const profile = useUserProfile();
const namespace = useUserNamespace(); // "maria.lisbon"
const village = useUserVillage();
```

---

### 2. Blockchain Store (`blockchainStore.ts`) 🆕

**Purpose**: Manages blockchain state (CORK tokens, NFTs, transactions)

**Data**:
- `corkBalance`: Current CORK token balance (cached)
- `ownedNFTs`: Array of owned bottle NFTs (cached)
- `transactions`: Transaction states (pending/success/failed)
- Loading states and errors

**Features**:
- **Automatic caching** (30 seconds for balance/NFTs)
- **Transaction tracking** (pending → success/failed)
- **Auto-refresh** capability
- **Backend sync ready** (transaction logging)

**Usage**:
```typescript
import { 
  useCorkBalance, 
  useOwnedNFTs, 
  useTransactions,
  useBlockchainStore 
} from '@/lib/stores';

// Get balance
const balance = useCorkBalance();

// Get NFTs
const nfts = useOwnedNFTs();

// Fetch balance
const { fetchCorkBalance } = useBlockchainStore();
await fetchCorkBalance(walletAddress);

// Track transaction
const { addTransaction, updateTransaction } = useBlockchainStore();
const txId = addTransaction({ 
  type: 'purchase', 
  status: 'pending' 
});

// Update on success
updateTransaction(txId, { 
  status: 'success', 
  digest: transactionDigest 
});
```

---

### 3. Backend Store (`backendStore.ts`) 🆕

**Purpose**: Manages backend sync state and profile data

**Data**:
- `backendProfile`: Backend profile from Supabase
- `syncing`: Sync in progress
- `lastSync`: Last sync timestamp
- `syncError`: Sync errors

**Features**:
- **Profile sync** with backend
- **Automatic caching** (1 minute)
- **Optimistic updates** support

**Usage**:
```typescript
import { 
  useBackendProfile, 
  useBackendStore 
} from '@/lib/stores';

// Get backend profile
const backendProfile = useBackendProfile();

// Sync profile to backend
const { syncProfile, fetchBackendProfile } = useBackendStore();
await syncProfile({
  walletAddress: '0x...',
  username: 'maria',
  village: 'lisbon',
});
```

---

## Integration Flow

### Complete User Journey with Stores

#### 1. Onboarding
```typescript
// User Store: Save onboarding data
const { setProfile } = useUserStore();
setProfile({
  username: 'maria',
  village: 'lisbon',
  namespaceId: '0x123...',
  walletAddress: '0xabc...',
});

// Backend Store: Sync to backend
const { syncProfile } = useBackendStore();
await syncProfile({
  walletAddress: '0xabc...',
  username: 'maria',
  village: 'lisbon',
  namespaceId: '0x123...',
  onboardingCompleted: true,
});
```

#### 2. Purchase Flow
```typescript
// Blockchain Store: Add pending transaction
const { addTransaction, updateTransaction } = useBlockchainStore();
const txId = addTransaction({
  type: 'purchase',
  status: 'pending',
});

// Execute blockchain transaction
const result = await purchaseBottle(...);

// Update transaction on success
updateTransaction(txId, {
  status: 'success',
  digest: result.digest,
  metadata: { nftId: result.nftId },
});

// Refresh blockchain state
const { refreshAll } = useBlockchainStore();
await refreshAll(walletAddress); // Updates balance + NFTs

// Backend: Log transaction
await logTransaction({
  walletAddress,
  transactionType: 'purchase',
  transactionDigest: result.digest,
  nftId: result.nftId,
  tokenAmount: 50,
});
```

#### 3. Post Creation
```typescript
// Create post (already handled in PostComposer)
// Backend Store: Post is saved to Supabase via API
// No store needed for posts (loaded via API)

// If tracking in store is needed:
const { addTransaction } = useBlockchainStore();
addTransaction({
  type: 'post_created',
  status: 'success',
  metadata: { postId: post.id },
});
```

---

## Store Sync Strategy

### User Profile Sync

```
User Store (local) ←→ Backend Store (Supabase)
     ↓
sessionStorage (onboarding persistence)
```

**Flow**:
1. User completes onboarding → Save to User Store
2. User Store persists to sessionStorage
3. Backend Store syncs to Supabase
4. Both stores stay in sync

### Blockchain State Sync

```
Blockchain Store (cache) ←→ SUI Blockchain ←→ Backend Store (logs)
     ↓
Cache (30s) for balance/NFTs
```

**Flow**:
1. Fetch from blockchain → Update Blockchain Store
2. Cache for 30 seconds
3. Log transaction to Backend Store
4. Backend syncs to Supabase

---

## Complete Store Usage Example

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

export function UserDashboard() {
  const account = useCurrentAccount();
  const walletAddress = account?.address;

  // User data
  const profile = useUserProfile();
  const backendProfile = useBackendProfile();

  // Blockchain data
  const corkBalance = useCorkBalance();
  const nfts = useOwnedNFTs();

  // Store actions
  const { refreshAll } = useBlockchainStore();
  const { fetchBackendProfile } = useBackendStore();

  // Load data on mount
  useEffect(() => {
    if (!walletAddress) return;

    // Fetch blockchain state
    refreshAll(walletAddress);

    // Fetch backend profile
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

### ✅ Caching
- **User Store**: sessionStorage persistence
- **Blockchain Store**: 30-second cache for balance/NFTs
- **Backend Store**: 1-minute cache for profile

### ✅ Loading States
- All stores have loading states
- Loading indicators can be shown in UI

### ✅ Error Handling
- All stores track errors
- Error messages can be displayed to users

### ✅ Optimistic Updates
- Blockchain Store supports optimistic updates
- Transactions can be added before confirmation

### ✅ Auto-refresh
- Blockchain Store can refresh all data
- Cache prevents unnecessary API calls

---

## Migration Guide

### From Local Storage to Stores

**Before** (localStorage only):
```typescript
const profile = JSON.parse(localStorage.getItem('profile'));
```

**After** (Zustand stores):
```typescript
const profile = useUserProfile();
const { syncProfile } = useBackendStore();
```

### From Direct Blockchain Calls to Store

**Before** (direct calls):
```typescript
const balance = await getCorkBalance(address);
```

**After** (with caching):
```typescript
const balance = useCorkBalance();
const { fetchCorkBalance } = useBlockchainStore();
await fetchCorkBalance(address); // Cached for 30s
```

---

## Best Practices

### 1. Use Selector Hooks
```typescript
// ✅ Good: Only re-renders when balance changes
const balance = useCorkBalance();

// ❌ Bad: Re-renders on any store change
const { corkBalance } = useBlockchainStore();
```

### 2. Fetch on Mount
```typescript
useEffect(() => {
  if (walletAddress) {
    refreshAll(walletAddress);
  }
}, [walletAddress]);
```

### 3. Sync After Actions
```typescript
// After purchase
await refreshAll(walletAddress); // Update blockchain state
await fetchBackendProfile(walletAddress); // Sync backend
```

### 4. Track Transactions
```typescript
const txId = addTransaction({ type: 'purchase', status: 'pending' });
// ... execute transaction ...
updateTransaction(txId, { status: 'success', digest: '...' });
```

---

## Summary

✅ **User Store** - Profile and onboarding (sessionStorage)  
✅ **Blockchain Store** - CORK, NFTs, transactions (blockchain + cache)  
✅ **Backend Store** - Backend sync (Supabase)  

**Complete integration ready!** 🚀


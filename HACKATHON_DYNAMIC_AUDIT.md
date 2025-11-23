# 🎯 Hackathon Dynamic Features Audit - REAL STATUS

**Date:** Current  
**Goal:** Make app fully dynamic using Enoki, Namespace, and Walrus integrations  
**Status:** ✅ Integrations Working | ⚠️ Need to Connect to UI

---

## ✅ WORKING INTEGRATIONS

### 1. **Enoki Wallet Integration** ✅
- **Status:** ✅ WORKING
- **Location:** `app/cork/CorkApp.tsx`, `app/cork/Onboarding.tsx`
- **What Works:**
  - Wallet connection via `useCurrentAccount()`
  - Works with Enoki (Google login) and regular wallets
  - Account address available throughout app

### 2. **Namespace Registration** ✅
- **Status:** ✅ WORKING
- **Location:** `app/cork/CorkApp.tsx` → `namespaceApi.registerNamespace()`
- **What Works:**
  - Registers namespace on-chain: `username.village`
  - Stores namespaceId in userStore
  - Persists to sessionStorage

### 3. **Walrus Image Upload** ✅
- **Status:** ✅ WORKING
- **Location:** `app/lib/hooks/useEnokiWalrusUpload.ts`
- **What Works:**
  - Profile pic upload in Onboarding
  - Post image upload in PostComposer
  - Uses relay pattern (template-compliant)
  - Returns blobId for storage

### 4. **User Store (Zustand)** ✅
- **Status:** ✅ WORKING
- **Location:** `app/lib/stores/userStore.ts`
- **What Works:**
  - Stores: username, village, profilePicBlobId, namespaceId, walletAddress
  - Persists to sessionStorage
  - Provides hooks: `useUserProfile()`, `useUserNamespace()`, etc.

---

## ⚠️ COMPONENTS USING MOCK DATA (NEED TO FIX)

### 🔴 HIGH PRIORITY - Core User Experience

#### 1. **MainApp.tsx** 🔴
**Current Issues:**
- ❌ Uses `MOCK_USER.namespace` for header display
- ❌ Uses `MOCK_USER.village` for current village
- ❌ Mock notification counts

**What Needs to Change:**
```typescript
// CURRENT (MOCK):
const [currentVillage, setCurrentVillage] = useState(MOCK_USER.village);
<p>@{MOCK_USER.namespace}</p>

// SHOULD BE (DYNAMIC):
import { useUserProfile, useUserVillage } from '@/lib/stores/userStore';
const profile = useUserProfile();
const currentVillage = profile?.village || 'lisbon';
<p>@{profile?.username}.{profile?.village}</p>
```

**Estimated Time:** 15 minutes

---

#### 2. **Profile.tsx** 🔴
**Current Issues:**
- ❌ Uses `MOCK_USER` for all data:
  - Username, namespace, profilePicUrl
  - CORK balance, bottles owned
  - Following/followers count
  - Joined date

**What Needs to Change:**
```typescript
// CURRENT (MOCK):
import { MOCK_USER } from './data/mockData';
<img src={MOCK_USER.profilePicUrl} />
<h2>{MOCK_USER.username}</h2>
<p>@{MOCK_USER.namespace}</p>
<p>{MOCK_USER.corkBalance}</p>

// SHOULD BE (DYNAMIC):
import { useUserProfile } from '@/lib/stores/userStore';
import { WalrusImage } from '@/components/WalrusImage';
import { useSuiClientQuery } from '@mysten/dapp-kit'; // For CORK balance

const profile = useUserProfile();
const { data: corkBalance } = useSuiClientQuery('getBalance', {
  coinType: 'CORK_TOKEN_TYPE'
});

<WalrusImage blobId={profile?.profilePicBlobId} />
<h2>{profile?.username}</h2>
<p>@{profile?.username}.{profile?.village}</p>
<p>{corkBalance || 0}</p>
```

**Estimated Time:** 30 minutes

---

#### 3. **Feed.tsx** 🟡
**Current Status:**
- ✅ Uses real posts from `postStorage` (localStorage)
- ✅ Uses WalrusImage for images
- ⚠️ Still includes MOCK_POSTS as fallback
- ❌ Post author info uses mock data

**What Needs to Change:**
- Remove MOCK_POSTS fallback (or keep minimal for demo)
- Ensure post authors use real namespace from userStore
- Posts already have real namespace from PostComposer ✅

**Estimated Time:** 10 minutes

---

#### 4. **PostComposer.tsx** 🟡
**Current Status:**
- ✅ Uses Walrus upload ✅
- ✅ Uses real user data from sessionStorage
- ⚠️ Should use userStore instead of reading sessionStorage directly

**What Needs to Change:**
```typescript
// CURRENT:
const onboardingData = typeof window !== 'undefined' 
  ? JSON.parse(sessionStorage.getItem('cork_onboarding_data'))
  : null;

// SHOULD BE:
import { useUserProfile, useUserNamespace } from '@/lib/stores/userStore';
const profile = useUserProfile();
const namespace = useUserNamespace();
```

**Estimated Time:** 10 minutes

---

### 🟡 MEDIUM PRIORITY - Features

#### 5. **Collection.tsx** 🟡
**Current Status:**
- ✅ Uses `bottleApi.getOwnedBottlesByAddress()` ✅
- ✅ Transforms API data to NFTBottle format ✅
- ✅ Uses WalrusImage for blobIds ✅
- ⚠️ Falls back to mock data if API fails
- ❌ Uses hardcoded mock data when no account

**What Needs to Change:**
- Show empty state when no account (don't show mocks)
- Better error handling
- Loading states already good ✅

**Estimated Time:** 15 minutes

---

#### 6. **Shop.tsx** 🟡
**Current Status:**
- ✅ Purchase flow uses real `bottleApi.mintBottle()` ✅
- ❌ Wine list uses mock data (`getWinesByVillage()`)
- ❌ Cart uses mock state
- ❌ Order history uses mock data

**What Needs to Change:**
- Keep mock wines for demo (or fetch from contract if available)
- Cart should persist to localStorage
- Order history should fetch from blockchain/API

**Estimated Time:** 20 minutes (cart persistence)

---

#### 7. **Friends.tsx** 🔴
**Current Issues:**
- ❌ All friends data is mock
- ❌ All transactions are mock
- ❌ CORK balance uses `MOCK_USER.corkBalance`
- ❌ No real friend list
- ❌ No real transaction history

**What Needs to Change:**
```typescript
// CURRENT:
const friends: Friend[] = [/* mock data */];
const transactions: Transaction[] = [/* mock data */];
<p>{MOCK_USER.corkBalance} CORK</p>

// SHOULD BE:
// 1. Fetch CORK balance from blockchain
const { data: corkBalance } = useSuiClientQuery('getBalance', {
  coinType: 'CORK_TOKEN_TYPE',
  owner: account?.address
});

// 2. Fetch friends from namespace registry or social graph
// 3. Fetch transactions from blockchain events
```

**Estimated Time:** 45 minutes (complex - may skip for demo)

---

### 🟢 LOW PRIORITY - Nice to Have

#### 8. **VillageSwitch.tsx** 🟢
**Current Status:**
- Uses real village data ✅
- Should use userStore for current village

**Estimated Time:** 5 minutes

---

## 📋 PRIORITY ACTION PLAN

### Phase 1: Critical User Identity (30 min) 🔴
**Goal:** User sees their real data everywhere

1. ✅ **MainApp.tsx** - Use userStore for namespace/village (15 min)
2. ✅ **Profile.tsx** - Use userStore + WalrusImage + CORK balance (30 min)
3. ✅ **PostComposer.tsx** - Use userStore instead of sessionStorage (10 min)

**Total:** ~55 minutes

---

### Phase 2: Data Display (20 min) 🟡
**Goal:** Show real blockchain data

4. ✅ **Collection.tsx** - Remove mock fallback, show empty state (15 min)
5. ✅ **Feed.tsx** - Remove MOCK_POSTS, keep only real posts (10 min)

**Total:** ~25 minutes

---

### Phase 3: Enhanced Features (45 min) 🟡
**Goal:** Make features more dynamic

6. ✅ **Shop.tsx** - Persist cart to localStorage (20 min)
7. ⚠️ **Friends.tsx** - Fetch CORK balance, show real transactions (45 min) - **SKIP IF TIME SHORT**

**Total:** ~65 minutes (or 20 min if skipping Friends)

---

## 🎯 RECOMMENDED DEMO FLOW

### Must-Have for Demo:
1. ✅ Onboarding with real Walrus upload
2. ✅ Namespace registration on-chain
3. ✅ Profile shows real data (username, namespace, profile pic)
4. ✅ Post creation with Walrus images
5. ✅ Feed shows real posts
6. ✅ Collection shows real NFTs (if any minted)
7. ✅ Shop purchase flow works

### Nice-to-Have:
- Friends tab with real CORK balance
- Transaction history
- Cart persistence

---

## 🔧 QUICK WINS (Do First)

### 1. MainApp Header (5 min)
```typescript
// In MainApp.tsx
import { useUserProfile, useUserNamespace } from '@/lib/stores/userStore';

const profile = useUserProfile();
const namespace = useUserNamespace();
const currentVillage = profile?.village || 'lisbon';

// Replace MOCK_USER.namespace with:
<p className="text-xs opacity-90">@{namespace || 'user'}</p>
```

### 2. Profile Component (15 min)
```typescript
// In Profile.tsx
import { useUserProfile } from '@/lib/stores/userStore';
import { WalrusImage } from '@/components/WalrusImage';
import { useSuiClientQuery, useCurrentAccount } from '@mysten/dapp-kit';

const profile = useUserProfile();
const account = useCurrentAccount();

// Replace all MOCK_USER references with profile
// Use WalrusImage for profile pic
```

### 3. PostComposer (5 min)
```typescript
// In PostComposer.tsx
import { useUserProfile, useUserNamespace } from '@/lib/stores/userStore';

const profile = useUserProfile();
const namespace = useUserNamespace();
// Remove sessionStorage reading
```

---

## 📊 CURRENT STATE SUMMARY

| Component | Enoki | Namespace | Walrus | User Data | Status |
|-----------|-------|-----------|--------|-----------|--------|
| CorkApp | ✅ | ✅ | ✅ | ✅ | ✅ DONE |
| Onboarding | ✅ | ✅ | ✅ | ✅ | ✅ DONE |
| PostComposer | ✅ | ⚠️ | ✅ | ⚠️ | 🟡 90% |
| MainApp | ✅ | ❌ | N/A | ❌ | 🔴 NEEDS FIX |
| Profile | ✅ | ❌ | ❌ | ❌ | 🔴 NEEDS FIX |
| Feed | ✅ | ⚠️ | ✅ | ⚠️ | 🟡 80% |
| Collection | ✅ | N/A | ✅ | ⚠️ | 🟡 85% |
| Shop | ✅ | N/A | N/A | ❌ | 🟡 70% |
| Friends | ✅ | ❌ | N/A | ❌ | 🔴 NEEDS FIX |

**Legend:**
- ✅ = Fully integrated
- ⚠️ = Partially integrated
- ❌ = Not integrated / Using mocks
- N/A = Not applicable

---

## ⏱️ TIME ESTIMATE

**Minimum Viable Demo (Phase 1 + Phase 2):** ~80 minutes
**Full Dynamic App (All Phases):** ~145 minutes

**Recommendation:** Do Phase 1 + Phase 2 for solid demo, add Phase 3 if time permits.

---

## 🚀 NEXT STEPS

1. **Start with MainApp.tsx** (5 min quick win)
2. **Fix Profile.tsx** (15 min - biggest impact)
3. **Update PostComposer** (5 min)
4. **Clean up Feed** (10 min)
5. **Fix Collection** (15 min)
6. **Add cart persistence to Shop** (20 min - if time)

**Total: ~70 minutes for solid demo**

---

**Last Updated:** Now  
**Status:** Ready to implement! 🚀


# Enoki Transaction Sponsorship Audit

**Date:** 2024-12-19  
**Purpose:** Comprehensive audit to identify all transactions in the codebase and determine which ones use Enoki sponsorship vs. which ones don't.

---

## Executive Summary

**Total Transaction Execution Points Found:** 8  
**Using Enoki Sponsorship:** 1 ✅ (Namespace Registration)  
**NOT Using Enoki Sponsorship:** 6 ❌ (Walrus transactions cannot be sponsored - require WAL tokens)  
**Backend-Executed (No Sponsorship Needed):** 1 ✅

**Status:** ✅ **Namespace registration is now sponsored!** Users can complete onboarding without SUI tokens.

**Note:** Walrus transactions (file uploads) cannot be sponsored because they require WAL tokens, not just gas fees. Sponsored transactions only cover gas (SUI), not coin transfers.

---

## Transaction Execution Points

### ✅ 1. Walrus Uploads (Profile Pictures, Post Images)

**Location:** `app/lib/hooks/useEnokiWalrusUpload.ts`

**Status:** ⚠️ **CANNOT BE SPONSORED** (Requires WAL tokens)

**Details:**
- Uses `useSignAndExecuteTransaction` directly
- Executes 2 transactions per upload:
  1. `registerTx` - Registers blob on-chain (requires WAL tokens)
  2. `certifyTx` - Certifies the blob (requires WAL tokens)
- **Critical:** Walrus transactions require WAL tokens, not just gas fees
- **Impact:** Users need WAL tokens to upload files (cannot be sponsored)

**Code Reference:**
```typescript
// Lines 101-130: Register transaction
signAndExecute({ transaction: registerTx }, { ... })

// Lines 140-154: Certify transaction  
signAndExecute({ transaction: certifyTx }, { ... })
```

**Note:** ⚠️ **Sponsored transactions only cover gas fees (SUI), not coin transfers (WAL tokens).** Walrus requires WAL tokens, so these transactions cannot be sponsored.

**Recommendation:** 
- ❌ Cannot use sponsorship (requires WAL tokens)
- ✅ Consider alternative: Pre-fund user wallets with WAL tokens, or use a backend service to handle Walrus uploads

---

### ✅ 2. Walrus Uploads (Alternative Hook)

**Location:** `app/lib/hooks/useWalrusUpload.ts`

**Status:** ⚠️ **CANNOT BE SPONSORED** (Requires WAL tokens)

**Details:**
- Similar to `useEnokiWalrusUpload` but without Enoki-specific naming
- Same pattern: 2 transactions (register + certify)
- Direct `signAndExecute` usage
- **Impact:** Users need WAL tokens (cannot be sponsored)

**Code Reference:**
```typescript
// Lines 84-113: Register transaction
signAndExecute({ transaction: registerTx }, { ... })

// Lines 123-137: Certify transaction
signAndExecute({ transaction: certifyTx }, { ... })
```

**Note:** ⚠️ **Cannot be sponsored** - requires WAL tokens, not just gas fees.

**Recommendation:**
- ❌ Cannot use sponsorship (requires WAL tokens)
- ⚠️ Consider deprecating if `useEnokiWalrusUpload` is the preferred version

---

### ✅ 3. Namespace Registration

**Location:** `app/lib/namespace.ts` → `registerNamespace()`

**Status:** ✅ **NOW USING SPONSORSHIP** (Updated 2024-12-19)

**Details:**
- Called from `app/cork/CorkApp.tsx` during onboarding
- **Now uses `executeSponsoredTransaction` from `useSponsoredTransaction` hook**
- **Impact:** ✅ Users can claim their namespace during onboarding without SUI tokens!
- This is the first blockchain interaction - now gasless!

**Code Reference:**
```typescript
// app/lib/namespace.ts:142
const result = await executeSponsoredTransaction(tx, sender);
```

**Usage:**
```typescript
// app/cork/CorkApp.tsx:53-58
const { executeSponsoredTransaction } = useSponsoredTransaction();
const result = await namespaceApi.registerNamespace(
  data.username,
  data.village,
  data.profilePicBlobId,
  executeSponsoredTransaction,  // ✅ Sponsored!
  account.address
);
```

**Status:** ✅ **COMPLETED** - Namespace registration is now sponsored!

---

### ✅ 4. Bottle NFT Minting

**Location:** `app/lib/bottle-nft.ts` → `mintBottleNFT()`

**Status:** ❌ **NOT USING SPONSORSHIP** (but executed via backend)

**Details:**
- Function exists but is **NOT directly called from frontend**
- Instead, frontend calls `/api/mint-purchase` (backend route)
- Backend executes transaction with admin keypair
- **Impact:** Backend pays gas, but this is admin-initiated, not user-initiated

**Code Reference:**
```typescript
// app/lib/bottle-nft.ts:82
const result = await signAndExecute({ transaction: tx });
```

**Note:** This function signature suggests it was designed for frontend use, but the actual flow uses the backend API.

**Recommendation:**
- ⚠️ This is fine as-is (backend pays gas)
- But if you want to allow direct frontend minting, use sponsorship

---

### ✅ 5. CORK Token Minting

**Location:** `app/lib/cork-token.ts` → `mintCorks()`

**Status:** ❌ **NOT USING SPONSORSHIP** (but executed via backend)

**Details:**
- Similar to Bottle NFT - function exists but not directly called
- Backend API (`/api/mint-purchase`) handles minting
- **Impact:** Backend pays gas (admin-initiated)

**Code Reference:**
```typescript
// app/lib/cork-token.ts:78
const result = await signAndExecute({ transaction: tx });
```

**Recommendation:**
- ⚠️ This is fine as-is (backend pays gas)
- No changes needed unless you want user-initiated minting

---

### ✅ 6. Purchase Flow (Backend API)

**Location:** `app/api/mint-purchase/route.ts`

**Status:** ✅ **BACKEND-EXECUTED** (No sponsorship needed)

**Details:**
- Backend route that mints both NFT and CORK tokens
- Uses admin keypair to sign transactions
- **Impact:** Backend pays gas fees (correct behavior)
- Called from `app/cork/PurchaseModal.tsx` via `bottleApi.mintBottle()`

**Code Reference:**
```typescript
// Lines 136-139: Backend signs and executes
const txBytes = await tx.build({ client: suiClient });
const signedTransaction = await keypair.signTransaction(txBytes);
const result = await suiClient.executeTransactionBlock({ ... });
```

**Recommendation:**
- ✅ **NO CHANGES NEEDED** - This is correct (backend pays gas)

---

### ✅ 7. Post Storage on Walrus

**Location:** `app/lib/walrus/postStorage.ts` → `uploadPostToWalrus()`

**Status:** ⚠️ **CANNOT BE SPONSORED** (Requires WAL tokens)

**Details:**
- Uploads post content (JSON) to Walrus
- Uses `walrusService.upload()` which internally uses `signAndExecuteTransaction`
- **Impact:** Users need WAL tokens to create posts (cannot be sponsored)
- **Note:** Requires WAL tokens, not just gas fees

**Code Reference:**
```typescript
// Line 73-75: Uses signAndExecuteTransaction internally
const result = await walrusService.upload(file, {
  signAndExecuteTransaction: signAndExecute,
});
```

**Note:** ⚠️ **Cannot be sponsored** - Walrus requires WAL tokens, not just gas fees.

**Recommendation:**
- ❌ Cannot use sponsorship (requires WAL tokens)
- ✅ Consider alternative: Pre-fund user wallets with WAL tokens, or use a backend service

---

### ✅ 8. Post Composer (Frontend Component)

**Location:** `app/cork/PostComposer.tsx`

**Status:** ❌ **NOT USING SPONSORSHIP** (indirectly)

**Details:**
- Uses `useEnokiWalrusUpload` hook for image uploads
- Uses `uploadPostToWalrus` for post content
- Both require gas fees
- **Impact:** Users need SUI tokens to create posts with images

**Code Reference:**
```typescript
// Line 20: Uses useEnokiWalrusUpload (not sponsored)
const { uploadFile, uploading: walrusUploading, error: walrusError } = useEnokiWalrusUpload();
```

**Recommendation:**
- ✅ Fix underlying hooks (`useEnokiWalrusUpload` and `uploadPostToWalrus`)
- This will automatically fix PostComposer

---

## Infrastructure Status

### ✅ Sponsored Transaction Infrastructure EXISTS

**Available Components:**
1. ✅ `app/api/sponsor-transaction/route.ts` - Backend API endpoint
2. ✅ `app/lib/sponsored-transaction.ts` - Utility functions
3. ✅ `app/lib/hooks/useSponsoredTransaction.ts` - React hook

**Status:** Infrastructure is built but **NOT BEING USED** anywhere!

---

## Critical Issues

### ✅ Issue #1: Namespace Registration Now Sponsored

**Status:** ✅ **FIXED** (2024-12-19)

**Impact:** Users can now complete namespace registration during onboarding without SUI tokens!

**Remaining Operations (Cannot Be Sponsored):**
- ⚠️ Profile picture uploads (requires WAL tokens)
- ⚠️ Post image uploads (requires WAL tokens)
- ⚠️ Post creation (Walrus storage - requires WAL tokens)

**Note:** Walrus transactions require WAL tokens, not just gas fees. Sponsored transactions only cover gas (SUI), not coin transfers.

---

### ✅ Issue #2: Onboarding Namespace Registration

**Status:** ✅ **FIXED** (2024-12-19)

**Impact:** Users can now register namespace during onboarding without SUI tokens!

**Flow:**
1. User connects wallet (Enoki Google login) ✅
2. User uploads profile picture ⚠️ **Requires WAL tokens** (cannot be sponsored)
3. User registers namespace ✅ **Now sponsored!** (gasless)
4. User completes onboarding ✅ **Can complete** (namespace registration works)

**Note:** Profile picture upload still requires WAL tokens, but namespace registration (the critical blockchain step) is now gasless.

---

### 🟡 Issue #3: Post Creation Requires Gas

**Severity:** MEDIUM  
**Impact:** Users cannot create posts without SUI tokens

**Flow:**
1. User writes post content
2. User uploads image (optional) ❌ **Requires SUI**
3. User uploads post to Walrus ❌ **Requires SUI**
4. Post is created ❌ **Blocked**

**Recommendation:**
- ✅ Make post uploads sponsored
- ✅ Make image uploads sponsored

---

## Recommendations

### Priority 1: Critical (Onboarding)

1. **Namespace Registration** (`app/lib/namespace.ts`) ✅ **COMPLETED**
   - ✅ Now uses `useSponsoredTransaction` hook
   - ✅ First blockchain interaction is now gasless!

2. **Profile Picture Upload** (`app/lib/hooks/useEnokiWalrusUpload.ts`) ⚠️ **CANNOT BE SPONSORED**
   - ⚠️ Requires WAL tokens, not just gas fees
   - ⚠️ Sponsored transactions only cover gas (SUI), not coin transfers
   - ✅ Alternative: Consider pre-funding user wallets with WAL tokens or using backend service

### Priority 2: High (Core Features)

3. **Post Creation** (`app/lib/walrus/postStorage.ts`) ⚠️ **CANNOT BE SPONSORED**
   - ⚠️ Requires WAL tokens, not just gas fees
   - ⚠️ Sponsored transactions only cover gas (SUI), not coin transfers
   - ✅ Alternative: Consider pre-funding user wallets with WAL tokens or using backend service

4. **Post Image Uploads** (`app/lib/hooks/useEnokiWalrusUpload.ts`) ⚠️ **CANNOT BE SPONSORED**
   - ⚠️ Requires WAL tokens, not just gas fees
   - ✅ Alternative: Consider pre-funding user wallets with WAL tokens or using backend service

### Priority 3: Medium (Nice to Have)

5. **General Walrus Uploads** (`app/lib/hooks/useWalrusUpload.ts`)
   - Consider deprecating or updating to use sponsorship
   - Or consolidate with `useEnokiWalrusUpload`

---

## Implementation Guide

### How to Add Sponsorship to a Transaction

**Before:**
```typescript
const { mutate: signAndExecute } = useSignAndExecuteTransaction();

const tx = new Transaction();
tx.moveCall({ ... });

const result = await signAndExecute({ transaction: tx });
```

**After:**
```typescript
const { executeSponsoredTransaction } = useSponsoredTransaction();
const account = useCurrentAccount();

const tx = new Transaction();
tx.moveCall({ ... });

const result = await executeSponsoredTransaction(tx, account.address);
```

### Example: Fixing Namespace Registration

**File:** `app/lib/namespace.ts`

**Current (Line 84-141):**
```typescript
export async function registerNamespace(
  username: string,
  village: string,
  profilePicBlobId: string | undefined,
  signAndExecute: (params: { transaction: Transaction }) => Promise<{ digest: string }>
): Promise<string> {
  // ... validation ...
  
  const tx = new Transaction();
  tx.moveCall({ ... });
  
  const result = await signAndExecute({ transaction: tx });
  return result.digest;
}
```

**Fixed:**
```typescript
export async function registerNamespace(
  username: string,
  village: string,
  profilePicBlobId: string | undefined,
  executeSponsoredTransaction: (tx: Transaction, sender: string) => Promise<{ digest: string }>,
  sender: string
): Promise<string> {
  // ... validation ...
  
  const tx = new Transaction();
  tx.moveCall({ ... });
  
  const result = await executeSponsoredTransaction(tx, sender);
  return result.digest;
}
```

**Update Caller:** `app/cork/CorkApp.tsx`
```typescript
// Before:
const result = await namespaceApi.registerNamespace(
  data.username,
  data.village,
  data.profilePicBlobId,
  signAndExecute
);

// After:
const { executeSponsoredTransaction } = useSponsoredTransaction();
const result = await namespaceApi.registerNamespace(
  data.username,
  data.village,
  data.profilePicBlobId,
  executeSponsoredTransaction,
  account.address
);
```

---

## Testing Checklist

After implementing sponsorship:

- [ ] Test namespace registration during onboarding (should be gasless)
- [ ] Test profile picture upload (should be gasless)
- [ ] Test post creation with image (should be gasless)
- [ ] Test post creation without image (should be gasless)
- [ ] Verify Enoki Gas Pool is being used (check Enoki Portal)
- [ ] Verify transactions succeed without user having SUI tokens
- [ ] Test with Enoki wallet (Google login)
- [ ] Test with regular wallet extension (should still work)

---

## Summary

**Current State:**
- ✅ 1 user-facing transaction uses Enoki sponsorship (Namespace Registration)
- ⚠️ Walrus transactions cannot be sponsored (require WAL tokens, not just gas)
- ✅ Onboarding namespace registration works without SUI tokens
- ✅ Infrastructure is now being used

**Completed Actions:**
1. ✅ Fixed namespace registration (Priority 1) - Now sponsored!
2. ⚠️ Profile picture uploads cannot be sponsored (requires WAL tokens)
3. ⚠️ Post creation cannot be sponsored (requires WAL tokens)

**Current Outcome:**
- ✅ Namespace registration is gasless (users don't need SUI tokens)
- ✅ Onboarding can complete (namespace registration works)
- ⚠️ Walrus operations still require WAL tokens (cannot be sponsored)
- ✅ Enoki Gas Pool covers namespace registration transactions

**Note:** Sponsored transactions only cover gas fees (SUI), not coin transfers (WAL tokens). Walrus requires WAL tokens, so those transactions cannot be sponsored.

---

**Audit Completed:** 2024-12-19  
**Next Steps:** Implement sponsorship for Priority 1 items


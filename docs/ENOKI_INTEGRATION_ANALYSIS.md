# Enoki Integration Analysis for Urban Villages

## 🎯 Overview

Enoki is Mysten Labs' managed infrastructure service for SUI that provides embedded wallets, transaction sponsorship, and simplified Web3 onboarding. This document analyzes how Enoki could address the current challenges in Urban Villages.

---

## 🔴 Current Issues Identified

### Issue 1: Proving Service Complexity
**Current State:**
- Custom zkLogin implementation requiring external proving service
- Using `https://prover-dev.mystenlabs.com/v1` (public endpoint)
- Manual JWT handling and signature generation
- Complex transaction signing flow

**Code Reference:**
- `app/lib/zkLogin.ts` - Manual zkLogin implementation
- `app/lib/hooks/useZkLoginWalrusUpload.ts` - Manual transaction signing

### Issue 2: Wallet Extension Requirement
**Current State:**
- Users need Sui Wallet extension for Walrus uploads
- Two-step authentication: zkLogin + wallet connection
- Confusing UX with wallet connection prompts

**Code Reference:**
- `WALRUS_WALLET_REQUIREMENTS.md` - Documents this issue
- `app/cork/PostComposer.tsx` - Requires wallet for image uploads

### Issue 3: Gas Fees & Sponsorship
**Current State:**
- Manual sponsor wallet pattern for gasless transactions
- Requires maintaining a funded sponsor wallet
- Complex transaction sponsorship logic

**Code Reference:**
- `NORMIE_ONBOARDING.md` - Mentions sponsor wallet pattern
- No centralized gas sponsorship system

### Issue 4: Transaction Signing Complexity
**Current State:**
- Multiple signing methods (zkLogin vs wallet extension)
- Inconsistent transaction flow
- Complex error handling

**Code Reference:**
- `ZKLOGIN_WALRUS_INTEGRATION.md` - Documents complexity
- Different hooks for different signing methods

### Issue 5: Embedded Wallet Management
**Current State:**
- Custom zkLogin user storage (sessionStorage)
- Manual JWT and salt management
- No cross-dapp wallet sharing

**Code Reference:**
- `app/lib/zkLogin.ts` - Custom user management
- Session-based storage (not persistent)

---

## ✅ How Enoki Solves These Issues

### Solution 1: Managed zkLogin Infrastructure

**What Enoki Provides:**
- ✅ Managed proving service (no setup required)
- ✅ Built-in zkLogin SDK (`@mysten/enoki-sdk`)
- ✅ Automatic JWT handling and signature generation
- ✅ Simple transaction signing API

**Benefits:**
- ❌ **Remove:** Custom proving service setup
- ❌ **Remove:** Manual JWT/salt management
- ✅ **Add:** Simple SDK integration
- ✅ **Add:** Managed infrastructure

**Code Comparison:**

**Before (Current):**
```typescript
// app/lib/zkLogin.ts
export async function signTransactionWithZkLogin(
  txBytes: Uint8Array,
  user: ZkLoginUser
): Promise<ZkLoginSignatureInputs> {
  const proverUrl = 'https://prover-dev.mystenlabs.com/v1';
  const response = await fetch(`${proverUrl}/zklogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jwt: user.jwt,
      txBytes: Array.from(txBytes),
      salt: user.salt,
      maxEpoch: user.maxEpoch || 0,
    }),
  });
  // Complex signature generation...
}
```

**After (With Enoki):**
```typescript
// app/lib/enoki.ts
import { EnokiClient } from '@mysten/enoki-sdk';

const enoki = new EnokiClient({
  apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
});

// Simple transaction signing
const signature = await enoki.signTransaction(txBytes, userId);
```

---

### Solution 2: Embedded Wallets (No Extension Needed)

**What Enoki Provides:**
- ✅ Embedded wallet infrastructure
- ✅ Wallet automatically created from zkLogin
- ✅ No browser extension required
- ✅ Persistent wallet across sessions

**Benefits:**
- ❌ **Remove:** Wallet extension requirement
- ❌ **Remove:** Two-step authentication
- ✅ **Add:** Seamless single-step onboarding
- ✅ **Add:** Automatic wallet management

**User Flow Comparison:**

**Before (Current):**
```
1. User clicks "Continue with Google" → zkLogin ✅
2. User tries to upload image → "Please connect wallet" ❌
3. User installs Sui Wallet extension
4. User connects wallet
5. User uploads image ✅
```

**After (With Enoki):**
```
1. User clicks "Continue with Google" → zkLogin + embedded wallet ✅
2. User uploads image → Works immediately ✅
```

**Code Comparison:**

**Before (Current):**
```typescript
// app/cork/PostComposer.tsx
const account = useCurrentAccount(); // Requires wallet extension

if (!account) {
  return <ConnectButton />; // User must connect wallet
}

const { uploadFile } = useWalrusUpload(); // Requires wallet
```

**After (With Enoki):**
```typescript
// app/cork/PostComposer.tsx
const { address } = useEnokiWallet(); // Always available after zkLogin
const { uploadFile } = useEnokiWalrusUpload(); // Works immediately
```

---

### Solution 3: Built-in Gas Sponsorship (Gas Pool)

**What Enoki Provides:**
- ✅ Gas Pool feature for sponsored transactions
- ✅ Managed sponsor wallet infrastructure
- ✅ Automatic gas fee covering
- ✅ Usage tracking and billing

**Benefits:**
- ❌ **Remove:** Manual sponsor wallet management
- ❌ **Remove:** Complex gas sponsorship logic
- ✅ **Add:** Managed gas pool
- ✅ **Add:** Usage analytics

**Code Comparison:**

**Before (Current):**
```typescript
// Manual sponsor wallet pattern
const sponsorWallet = new Keypair(); // You manage this
const sponsorBalance = await getBalance(sponsorWallet.address);
// Manual gas payment logic...
const result = await sponsorWallet.signAndExecuteTransactionBlock({
  transactionBlock: tx,
  // YOU pay the gas fee
});
```

**After (With Enoki):**
```typescript
// Enoki Gas Pool (automatic)
const tx = new Transaction();
tx.moveCall({...});

// Gas automatically sponsored by Enoki Gas Pool
const result = await enoki.sendTransaction(tx, {
  sponsorGas: true, // Automatic gas sponsorship
});
```

**Configuration:**
1. Create Gas Pool in Enoki Developer Portal
2. Fund the pool with SUI tokens
3. Enable `sponsorGas: true` in transactions
4. Enoki automatically pays gas fees

---

### Solution 4: Unified Transaction API

**What Enoki Provides:**
- ✅ Single SDK for all transaction types
- ✅ Consistent signing interface
- ✅ Unified error handling
- ✅ Automatic retry logic

**Benefits:**
- ❌ **Remove:** Multiple signing methods
- ❌ **Remove:** Inconsistent transaction flows
- ✅ **Add:** Single unified API
- ✅ **Add:** Consistent error handling

**Code Comparison:**

**Before (Current):**
```typescript
// Multiple different approaches
if (zkLogin) {
  // zkLogin signing
  const signature = await signTransactionWithZkLogin(txBytes, user);
} else if (wallet) {
  // Wallet extension signing
  const result = await wallet.signAndExecuteTransactionBlock({...});
} else {
  // No signing method
  throw new Error('No wallet connected');
}
```

**After (With Enoki):**
```typescript
// Single unified approach
const result = await enoki.sendTransaction(tx, {
  sponsorGas: true,
});
// Works for all users (zkLogin, wallet, etc.)
```

---

### Solution 5: Persistent Wallet Storage

**What Enoki Provides:**
- ✅ Cloud-based wallet storage
- ✅ Cross-device wallet access
- ✅ Enoki Connect for cross-dapp sharing
- ✅ Automatic wallet recovery

**Benefits:**
- ❌ **Remove:** SessionStorage wallet storage
- ❌ **Remove:** Manual JWT/salt persistence
- ✅ **Add:** Persistent wallet storage
- ✅ **Add:** Cross-device access

**Code Comparison:**

**Before (Current):**
```typescript
// Session-based storage
sessionStorage.setItem('zklogin_user', JSON.stringify(user));
// Lost on tab close, not shared across devices
```

**After (With Enoki):**
```typescript
// Cloud-based storage
const wallet = await enoki.getWallet(userId);
// Persistent across devices, sessions, browsers
```

---

## 🎯 Specific Benefits for Urban Villages

### Benefit 1: Namespace Registration
**Current Challenge:**
- Need to sponsor gas for namespace registration
- Complex transaction flow

**With Enoki:**
```typescript
// Simple namespace registration
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::namespace::register`,
  arguments: [username, village, profilePicBlobId],
});

const result = await enoki.sendTransaction(tx, {
  sponsorGas: true, // Free for user
});
```

### Benefit 2: Walrus Uploads
**Current Challenge:**
- Requires wallet extension
- Two-step authentication

**With Enoki:**
```typescript
// Automatic wallet, no extension needed
const { address } = useEnokiWallet();
// Upload works immediately after zkLogin
```

### Benefit 3: Post Creation
**Current Challenge:**
- Mixed wallet/zkLogin flow
- Inconsistent transaction signing

**With Enoki:**
```typescript
// Unified flow
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::posts::create`,
  arguments: [text, imageBlobId],
});

await enoki.sendTransaction(tx, { sponsorGas: true });
```

---

## 📊 Migration Path

### Phase 1: Setup Enoki (Week 1)
1. **Sign up for Enoki:**
   - Go to https://enoki.mystenlabs.com
   - Create developer account
   - Get API key

2. **Install SDK:**
   ```bash
   npm install @mysten/enoki-sdk
   ```

3. **Configure Enoki:**
   ```typescript
   // app/lib/enoki.ts
   import { EnokiClient } from '@mysten/enoki-sdk';
   
   export const enoki = new EnokiClient({
     apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
     network: 'testnet',
   });
   ```

4. **Set up Gas Pool:**
   - Create Gas Pool in Enoki Portal
   - Fund with SUI tokens
   - Configure usage limits

### Phase 2: Replace zkLogin (Week 2)
1. **Replace custom zkLogin with Enoki:**
   ```typescript
   // Before: app/lib/zkLogin.ts
   // After: app/lib/enoki.ts (using Enoki SDK)
   ```

2. **Update authentication flow:**
   - Replace custom zkLogin hooks with Enoki hooks
   - Update Onboarding component
   - Remove manual JWT/salt management

3. **Test authentication:**
   - Google OAuth with Enoki
   - Wallet creation
   - Session persistence

### Phase 3: Update Transactions (Week 3)
1. **Update Walrus uploads:**
   - Replace `useZkLoginWalrusUpload` with Enoki-based hook
   - Remove wallet extension requirement

2. **Update namespace registration:**
   - Use Enoki for transaction signing
   - Enable gas sponsorship

3. **Update post creation:**
   - Use Enoki for all transactions
   - Unified signing flow

### Phase 4: Cleanup (Week 4)
1. **Remove old code:**
   - Delete custom zkLogin implementation
   - Remove wallet extension checks
   - Remove manual sponsor wallet logic

2. **Update documentation:**
   - Remove wallet extension requirements
   - Update onboarding flow docs
   - Document Enoki integration

---

## 💰 Cost Analysis

### Current Costs:
- ❌ Managing own sponsor wallet: ~$50-100/month in SUI tokens
- ❌ Proving service infrastructure: ~$20-50/month (if self-hosted)
- ❌ Development time: Custom wallet management

### Enoki Costs:
- ✅ Gas Pool: Pay per transaction (~$0.001 per transaction)
- ✅ Managed infrastructure: Included in Enoki pricing
- ✅ Free tier: Available for testing/development

### Savings:
- 💰 No infrastructure to manage
- 💰 No sponsor wallet management
- 💰 Reduced development time
- 💰 Better user experience = more users

---

## 🎓 Code Examples

### Example 1: Namespace Registration with Enoki

```typescript
// app/lib/namespace.ts
import { enoki } from './enoki';
import { Transaction } from '@mysten/sui/transactions';

export async function registerNamespace(
  username: string,
  village: string,
  profilePicBlobId: string,
  userId: string
): Promise<string> {
  // Check availability first
  const isAvailable = await checkNamespaceAvailability(username, village);
  if (!isAvailable) {
    throw new Error('Namespace not available');
  }

  // Create transaction
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::namespace::register`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.pure(username),
      tx.pure(village),
      tx.pure(profilePicBlobId),
    ],
  });

  // Send with Enoki (gas sponsored automatically)
  const result = await enoki.sendTransaction(tx, {
    userId,
    sponsorGas: true,
  });

  return result.digest;
}
```

### Example 2: Walrus Upload with Enoki

```typescript
// app/lib/hooks/useEnokiWalrusUpload.ts
import { useEnokiWallet } from '@mysten/enoki-sdk/react';
import { enoki } from '../enoki';

export function useEnokiWalrusUpload() {
  const { address } = useEnokiWallet();

  const uploadFile = async (file: File): Promise<UploadResult> => {
    // Upload to Walrus
    const uploadResult = await walrus.upload(file);
    
    // Register blob on-chain with Enoki
    const tx = new Transaction();
    tx.moveCall({
      target: `${WALRUS_PACKAGE}::register`,
      arguments: [tx.pure(uploadResult.blobId)],
    });

    await enoki.sendTransaction(tx, {
      sponsorGas: true,
    });

    return uploadResult;
  };

  return { uploadFile };
}
```

### Example 3: Onboarding with Enoki

```typescript
// app/cork/Onboarding.tsx
import { useEnokiAuth } from '@mysten/enoki-sdk/react';

export function Onboarding({ onComplete }: OnboardingProps) {
  const { login, user } = useEnokiAuth();

  // Simple Google login
  const handleGoogleLogin = async () => {
    await login('google');
    // Wallet automatically created and ready to use!
  };

  // Wallet is always available after login
  const { address } = useEnokiWallet();

  // Upload works immediately
  const { uploadFile } = useEnokiWalrusUpload();

  // ... rest of onboarding flow
}
```

---

## 🔍 Comparison Table

| Feature | Current (Custom) | With Enoki |
|---------|------------------|------------|
| **zkLogin Setup** | Manual proving service | Managed by Enoki |
| **Wallet Extension** | Required for uploads | Not needed |
| **Gas Sponsorship** | Manual sponsor wallet | Enoki Gas Pool |
| **Transaction Signing** | Multiple methods | Unified API |
| **Wallet Storage** | SessionStorage | Cloud-based |
| **Cross-Device** | ❌ No | ✅ Yes |
| **Infrastructure** | Self-managed | Managed by Enoki |
| **Development Time** | High | Low |
| **User Experience** | Two-step auth | Single-step auth |

---

## 🎯 Recommendation

### ✅ **Yes, Integrate Enoki**

**Reasons:**
1. **Solves all current issues** in one integrated solution
2. **Better user experience** - no wallet extension needed
3. **Reduced complexity** - managed infrastructure
4. **Cost-effective** - pay per use vs. managing infrastructure
5. **Future-proof** - Enoki Connect for cross-dapp features

**Priority:**
- 🔥 **High Priority** - Solves critical UX issues
- ⚡ **Quick Win** - Can be integrated in 2-3 weeks
- 💰 **Cost Savings** - No infrastructure to manage
- 📈 **Growth** - Better UX = more users

**Next Steps:**
1. Sign up for Enoki (free tier for testing)
2. Create proof-of-concept with namespace registration
3. Test with real users
4. Migrate gradually (keep old code as fallback)
5. Full migration once proven

---

## 📚 Resources

- **Enoki Documentation:** https://docs.enoki.mystenlabs.com
- **Enoki SDK:** https://www.npmjs.com/package/@mysten/enoki-sdk
- **Enoki Portal:** https://enoki.mystenlabs.com
- **Enoki Connect:** https://docs.enoki.mystenlabs.com/enoki-connect

---

**Decision: Integrate Enoki to solve wallet complexity, gas sponsorship, and infrastructure management issues.**


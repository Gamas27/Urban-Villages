# Walrus Integration - Wallet Requirements

## Current Situation

**Walrus uploads require a REAL wallet connection** because they need to:
1. Sign a "register" transaction (to register the blob on-chain)
2. Sign a "certify" transaction (to certify the blob is stored)

## The Problem

- **zkLogin (mock or real)** creates a user identity and SUI address, but:
  - Mock zkLogin: Creates a fake address that can't sign transactions
  - Real zkLogin: Creates a real address, but signing requires a **proving service** (complex setup)

- **Walrus upload** uses `useCurrentAccount()` from `@mysten/dapp-kit`, which requires:
  - A wallet connected via WalletProvider (like Sui Wallet browser extension)
  - OR zkLogin transaction signing (requires proving service)

## Solutions

### Option 1: Use Real Wallet for Walrus (Recommended for Development)

Users can:
1. Authenticate with zkLogin (mock or real) for identity
2. **Also connect a real wallet** (Sui Wallet extension) for Walrus uploads

**Pros:**
- ✅ Works immediately
- ✅ No proving service needed
- ✅ Full functionality

**Cons:**
- ⚠️ Users need to install Sui Wallet extension
- ⚠️ Two-step process (zkLogin + wallet connection)

### Option 2: Implement zkLogin Transaction Signing

Use zkLogin to sign transactions directly (requires proving service).

**Pros:**
- ✅ Single authentication flow
- ✅ No wallet extension needed

**Cons:**
- ❌ Requires setting up a proving service
- ❌ More complex implementation
- ❌ Additional infrastructure costs

### Option 3: Hybrid Approach (Current Implementation)

- zkLogin for user identity and authentication
- Optional wallet connection for Walrus uploads
- Show clear messaging when wallet is needed

**Current behavior:**
- Users can complete onboarding without wallet
- Profile picture upload requires wallet connection
- Post image upload requires wallet connection
- Clear UI prompts guide users to connect wallet

## Recommendation

For **development and demos**, use **Option 1**:
1. Keep zkLogin for authentication (works with mock)
2. Add wallet connection step for Walrus uploads
3. Show clear UI: "Connect wallet to upload images"

For **production**, consider **Option 2** if you want seamless UX without wallet extensions.

## Current Implementation Status

✅ zkLogin authentication (mock or real)  
✅ Wallet connection prompts in UI  
✅ Walrus upload requires wallet (as designed)  
⚠️ Users need to connect wallet for image uploads

The app already handles this gracefully - it shows wallet connection prompts when needed!


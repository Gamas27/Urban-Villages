# Walrus WAL Token Requirement

## ⚠️ The Problem

Walrus storage transactions require **WAL tokens** to be paid as part of the transaction itself, not just for gas fees. 

**Sponsored transactions can only cover:**
- ✅ Gas fees (SUI tokens)

**Sponsored transactions CANNOT cover:**
- ❌ Coin transfers (WAL tokens required by Walrus)

## 🔍 Why This Happens

When you call `transaction.build()`, Sui validates that the sender has:
1. Enough coins for any transfers in the transaction (WAL tokens for Walrus)
2. Enough SUI for gas fees

Sponsored transactions can cover #2 (gas), but not #1 (coin transfers).

## 💡 Solutions

### Option 1: Fund User Wallets with WAL Tokens

**Pros:**
- Simple to implement
- Users can use Walrus directly

**Cons:**
- Users need to get WAL tokens somehow
- Requires a WAL token faucet or airdrop system

**Implementation:**
1. Create a WAL token faucet
2. Airdrop WAL tokens to new users
3. Users can then use Walrus

### Option 2: Backend Pays WAL Tokens

**Pros:**
- Users don't need WAL tokens
- You control the payment flow

**Cons:**
- More complex implementation
- You need to hold WAL tokens in a backend wallet

**Implementation:**
1. Create a backend service that holds WAL tokens
2. When user wants to upload, backend creates and signs the transaction
3. Backend pays WAL tokens from its own wallet
4. User only signs for authorization (if needed)

### Option 3: Alternative Storage Solution

**Pros:**
- No WAL token requirement
- Might be simpler

**Cons:**
- Need to migrate from Walrus
- Different storage characteristics

**Alternatives:**
- IPFS (via Pinata, Web3.Storage, etc.)
- Arweave
- Traditional cloud storage (S3, etc.)

## 🎯 Recommended Approach

For now, **Option 1** (fund user wallets) is the simplest:

1. **Create a WAL token faucet** that gives new users WAL tokens
2. **Or airdrop WAL tokens** when users complete onboarding
3. **Users can then use Walrus** without issues

### Quick Implementation:

```typescript
// Backend API: /api/airdrop-wal
// Airdrops WAL tokens to user's wallet
// You hold WAL tokens in a backend wallet and transfer them to users
```

## 📝 Current Status

- ✅ Sponsored transactions work for gas fees (SUI)
- ❌ Sponsored transactions cannot cover WAL token requirements
- ⚠️ Users still need WAL tokens for Walrus uploads

## 🔄 Next Steps

1. **Decide on approach** (faucet, backend payment, or alternative storage)
2. **Implement chosen solution**
3. **Test end-to-end flow**


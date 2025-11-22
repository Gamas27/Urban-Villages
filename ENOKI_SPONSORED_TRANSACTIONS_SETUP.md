# Enoki Sponsored Transactions Setup

## ✅ What This Solves

Sponsored transactions allow users to perform on-chain actions (like Walrus uploads) **without needing SUI or WAL tokens**. You (the app) pay the gas fees on their behalf.

**Benefits:**
- ✅ Users don't need to fund their wallets
- ✅ No more "Not enough coins" errors
- ✅ Gasless user experience
- ✅ Better onboarding flow

## 🔧 Setup Steps

### Step 1: Add Private API Key to Environment

Add your Enoki **Private API Key** to your environment variables:

**For local development** (`.env.local`):
```bash
# Enoki Private API Key (for gas sponsorship - BACKEND ONLY!)
ENOKI_PRIVATE_API_KEY=enoki_private_171c5584dce22874b2b9f27715e9caf3
```

**Important:**
- ⚠️ This is a **PRIVATE** key - never commit it to Git
- ⚠️ Only use in backend/server-side code
- ⚠️ Don't add `NEXT_PUBLIC_` prefix (that would expose it to frontend)

### Step 2: Set Up Gas Pool in Enoki Portal (Optional but Recommended)

1. Go to [Enoki Developer Portal](https://enoki.mystenlabs.com/)
2. Select your project
3. Go to "Gas Pool" section
4. Create a new Gas Pool
5. Fund it with SUI tokens (for testnet, use testnet SUI)
6. Configure usage limits if needed

**Note:** The Gas Pool is managed by Enoki and automatically used when you create sponsored transactions.

### Step 3: Restart Your Dev Server

After adding the environment variable:
```bash
pnpm dev
```

## 📋 How It Works

### Flow:

1. **User initiates action** (e.g., uploads profile picture)
2. **Frontend builds transaction** (e.g., Walrus register transaction)
3. **Frontend sends to backend API** (`/api/sponsor-transaction`)
4. **Backend sponsors transaction** using Enoki Private API Key
5. **Backend returns sponsored transaction bytes**
6. **Frontend signs and executes** the sponsored transaction
7. **Gas is paid by your Enoki Gas Pool** (not the user!)

### Code Example:

```typescript
// Frontend: useEnokiWalrusUpload hook
const { uploadFile } = useEnokiWalrusUpload();

// When user uploads a file:
const result = await uploadFile(file);
// Transaction is automatically sponsored - user pays nothing!
```

## 🧪 Testing

1. **Connect with Google** (Enoki wallet)
2. **Try uploading a profile picture**
3. **Check browser console** - should see no "Not enough coins" errors
4. **Check Enoki Portal** - Gas Pool usage should show transactions

## ⚠️ Troubleshooting

### Error: "Enoki private API key not configured"
- Make sure `ENOKI_PRIVATE_API_KEY` is in `.env.local`
- Restart your dev server after adding it
- Don't use `NEXT_PUBLIC_` prefix

### Error: "Failed to sponsor transaction"
- Check that your Gas Pool has funds
- Verify the private API key is correct
- Check Enoki Portal for any errors

### Transactions still failing
- Make sure Gas Pool is funded with SUI tokens
- Check network (testnet vs mainnet) matches your setup
- Verify Enoki project is active

## 📊 Cost Considerations

- **Gas Pool:** Fund with SUI tokens (you control the amount)
- **Cost per transaction:** ~0.001 SUI per transaction (very low)
- **Monitoring:** Check Gas Pool usage in Enoki Portal

## 🎯 Next Steps

After setup:
1. ✅ Test Walrus uploads (should work without user funding)
2. ✅ Test namespace registration (update to use sponsored transactions)
3. ✅ Monitor Gas Pool usage in Enoki Portal
4. ✅ Set up alerts for low Gas Pool balance

## 📝 Files Changed

- ✅ `app/api/sponsor-transaction/route.ts` - Backend API for sponsoring
- ✅ `app/lib/sponsored-transaction.ts` - Utility functions
- ✅ `app/lib/hooks/useSponsoredTransaction.ts` - React hook
- ✅ `app/lib/hooks/useEnokiWalrusUpload.ts` - Updated to use sponsored transactions

